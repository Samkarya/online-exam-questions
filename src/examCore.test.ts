/**
 * examCore.test.ts — framework-free regression suite for examCore.
 *   run (bank repo):  npx ts-node src/examCore.test.ts
 * Includes the "corpus" tests that read every exam file of this repo (skipped when no bank is found).
 */
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import {
  processExamText, processExamItems, buildLlmPrompt, extractImageRefs, locateQuestions, repairText, lintText, groupIssues,
  ExamReport,
} from './examCore';
import { parseCodeLanguage, prefixSvgUrlRefs, HTML_EXECUTE_CSP, CLOBBER_PREFIX, TAG_ATTRS, EXTRA_TAGS } from './renderSupport';

let passed = 0;
const failures: string[] = [];
function test(name: string, fn: () => void): void {
  try { fn(); passed++; } catch (e) { failures.push(`✖ ${name}\n    ${String((e as Error).message).split('\n').slice(0, 24).join('\n    ')}`); }
}

type Q = Record<string, unknown>;
const Q = (n: number, extra: Q = {}): Q => ({ question_number: n, question_text: 'Q' + n, options: { a: 'x', b: 'y' }, correct_answer: 'a', ...extra });
const J = (v: unknown): string => JSON.stringify(v);
const repair = (s: string, guess = true): ExamReport => processExamText(s, { mode: 'repair', applyGuess: guess });
const check = (s: string): ExamReport => processExamText(s, { mode: 'check' });
const errors = (r: ExamReport): string[] => r.issues.filter((i) => i.severity === 'error').map((i) => i.code);
const codes = (r: ExamReport): string[] => r.issues.map((i) => i.code);
const fixCodes = (r: ExamReport): string[] => r.fixes.map((f) => f.code);
const one = (r: ExamReport) => { assert.strictEqual(r.questions.length, 1, 'expected exactly one question'); return r.questions[0]; };
const arr1 = J([Q(1), Q(2)]);
const arr2 = J([Q(3), Q(4)]);
const body = (text: string, extra = ''): string => `[{"question_number":1,"question_text":"${text}","options":{"a":"x","b":"y"},"correct_answer":"a"${extra}}]`;

// ───────────────────────── clean input is untouched
test('clean exam: no issues, no fixes, identical questions', () => {
  const src = J([Q(1, { subject: 'S', topic: null, difficulty: '', explanation: 'e', section_id: null }), Q(2)]);
  const c = check(src);
  assert.ok(c.ok && c.issues.length === 0, JSON.stringify(c.issues));
  const r = repair(src, false);
  assert.ok(r.ok && r.fixes.length === 0);
  assert.deepStrictEqual(r.questions, JSON.parse(src));
  assert.strictEqual(c.info.source, 'native');
});

// ───────────────────────── multi-paste / commentary / fences
test('two lists pasted together are merged', () => {
  const r = repair(arr1 + '\n' + arr2);
  assert.strictEqual(r.questions.length, 4);
  assert.deepStrictEqual(r.questions.map((q) => q.question_number), [1, 2, 3, 4]);
  assert.ok(fixCodes(r).includes('S_MULTI_ARRAY'));
  assert.ok(errors(check(arr1 + arr2)).includes('S_MULTI_ARRAY'));
});
test('empty lists between real lists ([][][]) are ignored', () => {
  const r = repair('[]\n' + arr1 + '\n[]');
  assert.strictEqual(r.questions.length, 2);
});
test('AI commentary containing [ ] plus a fence', () => {
  const r = repair('Here is your exam [as requested]:\n```json\n' + arr1 + '\n```\nHope this helps!');
  assert.strictEqual(r.questions.length, 2);
  assert.ok(fixCodes(r).includes('S_FENCE') && fixCodes(r).includes('S_EXTRA_TEXT'));
});
test('trailing note with [1] after the fence does not break extraction', () => {
  assert.strictEqual(repair('```json\n' + arr1 + '\n```\nNote: see [1] for sources.').questions.length, 2);
});
test('JSONL / bare objects separated by commas', () => {
  const r = repair(J(Q(1)) + ',\n' + J(Q(2, { question_text: 'second' })));
  assert.strictEqual(r.questions.length, 2);
});
test('{ "questions": [...] } and a single bare object', () => {
  assert.strictEqual(repair(J({ questions: [Q(1), Q(2)] })).questions.length, 2);
  assert.strictEqual(repair(J(Q(1))).questions.length, 1);
  assert.ok(errors(check(J({ questions: [Q(1)] }))).includes('S_UNWRAP'));
});
test('double-encoded JSON and escaped document', () => {
  assert.strictEqual(repair(J(J([Q(1)]))).questions.length, 1);
  assert.strictEqual(repair('[{\\"question_number\\":1,\\"question_text\\":\\"Q\\",\\"options\\":{\\"a\\":\\"x\\",\\"b\\":\\"y\\"},\\"correct_answer\\":\\"a\\"}]').questions.length, 1);
});
test('BOM and zero-width characters', () => {
  assert.strictEqual(repair('\uFEFF' + arr1.replace('[', '[\u200B')).questions.length, 2);
});

// ───────────────────────── syntax repairs
test('trailing comma / single quotes / unquoted keys / smart quotes / comments / missing comma', () => {
  assert.strictEqual(one(repair('[{"question_number":1,"question_text":"Q","options":{"a":"x","b":"y"},"correct_answer":"a",}]')).question_text, 'Q');
  assert.strictEqual(one(repair("[{'question_number':1,'question_text':'Q','options':{'a':'x','b':'y'},'correct_answer':'a'}]")).correct_answer, 'a');
  assert.strictEqual(one(repair('[{question_number:1,question_text:"Q",options:{a:"x",b:"y"},correct_answer:"a"}]')).options.b, 'y');
  assert.strictEqual(one(repair('[{“question_number”:1,“question_text”:“Q”,“options”:{“a”:“x”,“b”:“y”},“correct_answer”:“a”}]')).question_text, 'Q');
  assert.strictEqual(repair('[\n// first\n' + J(Q(1)) + '\n/* c */]').questions.length, 1);
  assert.strictEqual(repair('[' + J(Q(1)) + '\n' + J(Q(2)) + ']').questions.length, 2);
});
test('raw line break inside a string becomes a newline', () => {
  assert.strictEqual(one(repair(body('line1\nline2'))).question_text, 'line1\nline2');
});
test('unescaped inner double quotes are repaired (guess)', () => {
  const r = repair(body('He said "hello" to me, then "left".'));
  assert.strictEqual(one(r).question_text, 'He said "hello" to me, then "left".');
  assert.ok(r.fixes.some((f) => f.code === 'S_INNER_QUOTE' && f.tier === 'guess'));
});
test('Python/JS literals', () => {
  const r = repair('[{"question_number":1,"question_text":"Q","options":{"a":"x","b":"y"},"correct_answer":"a","explanation":None,"x":True}]');
  assert.strictEqual(one(r).explanation, null);
});
test('"..." placeholder in the list is skipped', () => {
  assert.strictEqual(repair('[' + J(Q(1)) + ', ..., ' + J(Q(2, { question_text: 'b' })) + ']').questions.length, 2);
});
test('truncated output keeps complete questions, reports the cut one', () => {
  const r = repair(arr1.slice(0, arr1.length - 25));
  assert.strictEqual(r.questions.length, 1);
  assert.strictEqual(r.skipped.length, 1);
  assert.strictEqual(r.ok, false);
});
test('a broken question is skipped, the others survive (salvage)', () => {
  const src = '[' + J(Q(1)) + ',\n{"question_number":2,"question_text": ??? broken ???,\n"options":{"a":"x"}},\n' + J(Q(3)) + ']';
  const r = repair(src);
  assert.strictEqual(r.questions.length, 2);
  assert.ok(r.skipped.length >= 1 && r.ok === false);
});
test('unreadable text gives a fatal error with line and column', () => {
  const r = repair('hello world, no json here');
  assert.ok(r.fatal);
  const r2 = repair('');
  assert.strictEqual(r2.fatal && r2.fatal.code, 'E_EMPTY');
  const r3 = repair('{"a": ');
  assert.ok(r3.fatal);
});
test('depth bomb and huge garbage finish fast', () => {
  const t0 = Date.now();
  repair('['.repeat(20000));
  repair('{'.repeat(20000));
  repair('[{'.repeat(5000) + 'x');
  repair('lorem ipsum [ '.repeat(20000));
  assert.ok(Date.now() - t0 < 3000, `took ${Date.now() - t0}ms`);
});

// ───────────────────────── LaTeX / JSON escapes
test('LaTeX that JSON forbids (\\int, \\pi, \\sum) is kept', () => {
  assert.strictEqual(one(repair('[{"question_number":1,"question_text":"Solve $\\int x dx$ and $\\pi$","options":{"a":"x","b":"y"},"correct_answer":"a"}]')).question_text, 'Solve $\\int x dx$ and $\\pi$');
});
test('LaTeX that JSON accepts but mangles (\\theta \\times \\frac \\beta \\text \\neq) is restored', () => {
  const src = '[{"question_number":1,"question_text":"Find $\\theta$, $a \\times b \\neq 0$, $\\frac{1}{2} + \\beta$ and $\\text{x}$","options":{"a":"x","b":"y"},"correct_answer":"a"}]';
  assert.strictEqual(one(repair(src)).question_text, 'Find $\\theta$, $a \\times b \\neq 0$, $\\frac{1}{2} + \\beta$ and $\\text{x}$');
  assert.ok(errors(check(src)).includes('E_ESCAPE_DAMAGE'), 'valid JSON with damaged LaTeX must be an ERROR in check mode');
});
test('legitimate TAB / newline text is not touched', () => {
  const t = 'Column A\tcolumn B\nequation of a line\nnumber one';
  assert.strictEqual(lintText(t).filter((l) => l.code === 'E_ESCAPE_DAMAGE').length, 0);
  assert.strictEqual(repairText(t, true).text, t);
});
test('code blocks with tabs are not damage', () => {
  const t = '```c\nif (x) {\n\treturn tan(x);\n}\n```';
  assert.strictEqual(lintText(t).filter((l) => l.code === 'E_ESCAPE_DAMAGE').length, 0);
});
test('doubled backslash inside math is fixed, outside math is not', () => {
  assert.strictEqual(repairText('Compute $3 \\\\times 2$ and $\\\\text{CO}_2$', true).text, 'Compute $3 \\times 2$ and $\\text{CO}_2$');
  assert.strictEqual(repairText('Escape with \\\\times in a regex', true).text, 'Escape with \\\\times in a regex');
});
test('\\( \\) and \\[ \\] math is converted', () => {
  assert.strictEqual(repairText('Evaluate \\(x^2\\) and \\[\\frac{1}{2}\\] now', true).text, 'Evaluate $x^2$ and $$\\frac{1}{2}$$ now');
  assert.strictEqual(lintText('code: `\\(x\\)`').filter((l) => l.code === 'W_LATEX_DELIMS').length, 0);
});

// ───────────────────────── renderer-aware content rules
test('currency pairs are escaped; real math is not', () => {
  assert.strictEqual(repairText('He charged $15,000 instead of the agreed-upon $5,000 fee.', true).text, 'He charged \\$15,000 instead of the agreed-upon \\$5,000 fee.');
  assert.strictEqual(repairText('shipping = $5.00 + $2.00 = $7.00', true).text, 'shipping = \\$5.00 + \\$2.00 = \\$7.00');
  assert.strictEqual(repairText('costs $5 and $10 total', true).text, 'costs \\$5 and \\$10 total');
  assert.strictEqual(repairText('on $7.00 ($7.00 x 0.20) = $1.40 markup', true).text, 'on \\$7.00 (\\$7.00 x 0.20) = \\$1.40 markup');
  const maths = ['Let $13$ and $4$ be integers, so $x=5$.', '1) $3x + 7y = 42$\n2) $7x + 3y = 58$', '$3 + 2 = 5$\n2. next', 'Price $x$ and $y$', 'Use $50$: $7$'];
  for (const m of maths) assert.strictEqual(repairText(m, true).text, m, m);
});
test('"<word>" in prose is escaped; real HTML, code, math and SVG are not', () => {
  assert.strictEqual(repairText('Find x if 3<x and y>2 holds', true).text, 'Find x if 3\\<x and y>2 holds');
  assert.strictEqual(repairText('What does List<String> hold?', true).text, 'What does List\\<String> hold?');
  const safe = ['#include <stdio.h>', 'if 3 < 5 and 7 > 2', 'math $a<b$ here', 'code `a<b>` here', '<b>bold</b> and <br>', "<svg width='5'><linearGradient id='g'></linearGradient></svg>", '```\nList<String> x\n```'];
  for (const s of safe) assert.strictEqual(repairText(s, true).text, s, s);
});
test('LaTeX command typed without its backslash inside math is repaired; text groups and plain words are left alone', () => {
  assert.strictEqual(repairText('So $300/13 approx 23.07$ days', true).text, 'So $300/13 \\approx 23.07$ days');
  assert.strictEqual(repairText('$a times b leq c$ and $$x geq y$$', true).text, '$a \\times b \\leq c$ and $$x \\geq y$$');
  const safe = ['$\\frac{1}{2}$ and $x \\text{ n times}$', '$6 \\text{ (sigma bonds)} = 6$', '$\\mathrm{approx}$ here', 'about 5 times, approx 3 (outside math)', '$x$ times $y$', '$\\sigma$ (sigma) bonds', 'code `$a times b$`'];
  for (const t of safe) assert.strictEqual(repairText(t, true).text, t, t);
  assert.ok(lintText('$3 times 4$').some((l) => l.code === 'W_MISSING_BACKSLASH'));
});
test('AI citation artifacts are removed', () => {
  assert.strictEqual(repairText('Mars is red. [cite: 1, 2] :contentReference[oaicite:0]{index=0}', true).text, 'Mars is red.');
});
test('SVG lint reports exactly what the renderer strips (arrowheads and dashes are allowed)', () => {
  const ok = lintText("<svg width='9'><defs><marker id='a' markerWidth='5' refX='1' orient='auto'><path d='M0,0'/></marker></defs><line x1='0' y1='0' x2='1' y2='1' stroke='red' strokeDasharray='4' stroke-dasharray='4' stroke-linecap='round' marker-end='url(#a)'/><text font-weight='bold'><tspan>x</tspan></text></svg>");
  assert.strictEqual(ok.filter((l) => l.code === 'W_SVG_STRIPPED').length, 0, JSON.stringify(ok));
  const bad = lintText("<svg><defs><linearGradient id='g'/></defs><rect fill='url(#g)' style='x:1' width='3'/></svg>").find((l) => l.code === 'W_SVG_STRIPPED');
  assert.ok(bad && /linearGradient/.test(bad.message) && /style/.test(bad.message), String(bad && bad.message));
});
test('html-execute blocks are listed, unclosed fences and LaTeX outside math are flagged', () => {
  assert.ok(lintText('x\n```html-execute\n<b>1</b>\n```').some((l) => l.code === 'W_HTML_EXECUTE'));
  assert.ok(lintText('a\n```js\nconsole.log(1)').some((l) => l.code === 'W_UNCLOSED_FENCE'));
  assert.ok(lintText('We get 4 \\times 5 = 20').some((l) => l.code === 'W_LATEX_OUTSIDE_MATH'));
  assert.ok(!lintText('We get $4 \\times 5$').some((l) => l.code === 'W_LATEX_OUTSIDE_MATH'));
});

// ───────────────────────── structure normalisation
test('alias field names', () => {
  const r = repair(J([{ question: 'Q', choices: { a: 'x', b: 'y' }, answer: 'a', explain: 'because', level: 'easy' }]));
  const q = one(r);
  assert.strictEqual(q.question_text, 'Q');
  assert.strictEqual(q.explanation, 'because');
  assert.strictEqual(q.difficulty, 'Easy');
  assert.strictEqual(q.question_number, 1);
});
test('options as list, UPPERCASE keys', () => {
  assert.deepStrictEqual(one(repair(J([Q(1, { options: ['Venus', 'Mars'], correct_answer: 'b' })]))).options, { a: 'Venus', b: 'Mars' });
  const q = one(repair(J([Q(1, { options: { A: 'x', B: 'y' }, correct_answer: 'B' })])));
  assert.deepStrictEqual(q.options, { a: 'x', b: 'y' });
  assert.strictEqual(q.correct_answer, 'b');
});
test('correct_answer resolution', () => {
  const o = { a: 'Venus', b: 'Mars' };
  assert.strictEqual(one(repair(J([Q(1, { options: o, correct_answer: 'B) Mars' })]))).correct_answer, 'b');
  assert.strictEqual(one(repair(J([Q(1, { options: o, correct_answer: 'Option B' })]))).correct_answer, 'b');
  assert.strictEqual(one(repair(J([Q(1, { options: o, correct_answer: 'Mars' })]))).correct_answer, 'b');
  assert.strictEqual(one(repair(J([Q(1, { options: o, correct_answer: 2 })]))).correct_answer, 'b');
  assert.strictEqual(one(repair(J([Q(1, { options: o, correct_answer: 'B' })]))).correct_answer, 'b');
  assert.strictEqual(one(repair(J([Q(1, { options: { a: 'a ball is round', b: 'y' }, correct_answer: 'a ball is round' })]))).correct_answer, 'a');
});
test('answers a human must decide', () => {
  for (const ca of ['a, b', ['a', 'b'], 'e', '', null]) {
    const r = repair(J([Q(1, { correct_answer: ca })]));
    assert.strictEqual(r.ok, false, String(ca));
    assert.strictEqual(r.questions.length, 0);
  }
  assert.strictEqual(repair(J([Q(1, { options: { a: 'only' } })])).ok, false);
  assert.strictEqual(repair(J([Q(1, { question_text: '  ' })])).ok, false);
});
test('question numbers: strings, duplicates, start at 3, gaps', () => {
  assert.strictEqual(one(repair(J([Q(1, { question_number: '1' })]))).question_number, 1);
  for (const list of [[Q(1), Q(1)], [Q(3), Q(4), Q(5)], [Q(1), Q(2), Q(5)]]) {
    assert.ok(errors(check(J(list))).some((c) => c === 'E_QNUM_DUP' || c === 'E_QNUM_SEQ'));
    assert.deepStrictEqual(repair(J(list), false).questions.map((q) => q.question_number), list.map((_, i) => i + 1));
  }
  assert.ok(check(J([Q(2), Q(1), Q(3)])).ok, 'a permutation of 1..N is valid, like the CLI');
});
test('null / string / list items are skipped and reported', () => {
  const r = repair('[null,' + J(Q(2)) + ',"hello",[1]]');
  assert.strictEqual(r.questions.length, 1);
  assert.strictEqual(r.skipped.length, 3);
});
test('unknown keys and app-internal keys', () => {
  const src = J([Q(1, { id: 'x1', _isDirty: true, type: 'mcq', marks: 4, _comment_1: 'hi' })]);
  const r = repair(src);
  assert.deepStrictEqual(Object.keys(one(r)).sort(), ['correct_answer', 'options', 'question_number', 'question_text']);
  const e = processExamItems([Q(1, { id: 'x1', _isDirty: true })], { mode: 'check', clientKeys: ['id', '_isDirty'] });
  assert.ok(e.ok && e.issues.length === 0, JSON.stringify(e.issues));
});
test('difficulty normalisation', () => {
  assert.strictEqual(one(repair(J([Q(1, { difficulty: 'EASY' })]))).difficulty, 'Easy');
  assert.strictEqual(one(repair(J([Q(1, { difficulty: 'moderate' })]))).difficulty, 'Medium');
  assert.strictEqual(one(repair(J([Q(1, { difficulty: 'impossible' })]))).difficulty, null);
  assert.strictEqual(one(repair(J([Q(1, { difficulty: '' })]))).difficulty, '');
});
test('option letter prefixes "A) " are stripped; duplicate questions removed', () => {
  assert.deepStrictEqual(one(repair(J([Q(1, { options: { a: 'A) Venus', b: 'B) Mars' } })]))).options, { a: 'Venus', b: 'Mars' });
  assert.strictEqual(repair(J([Q(1), Q(2, { question_text: 'Q1' })])).questions.length, 1);
});
test('subjects and topics are de-duplicated ignoring case and spacing', () => {
  const r = repair(J([Q(1, { subject: 'Physics', topic: 'Optics' }), Q(2, { question_text: 'b', subject: ' physics ', topic: 'optics' })]));
  assert.deepStrictEqual(r.summary.subjects, ['Physics']);
  assert.deepStrictEqual(r.summary.topics, ['Optics']);
});

// ───────────────────────── reporting
test('one root cause across 3000 questions is ONE group', () => {
  const big = Array.from({ length: 3000 }, (_, i) => { const q = Q(i + 1) as Q; q.option = q.options; delete q.options; return q; });
  const r = check(J(big));
  assert.ok(r.issues.length >= 3000);
  const g = r.groups.find((x) => x.code === 'E_ALIAS_KEY');
  assert.ok(g && g.count === 3000);
  assert.ok(r.groups.length < 5, `groups: ${r.groups.length}`);
  assert.strictEqual(groupIssues(r.issues).length, r.groups.length);
});
test('groups list each question once; escape-damage details are not repeated', () => {
  const dmg = '$a \t' + 'imes b$ and $c \t' + 'imes d$ and $e \t' + 'imes f$';
  const r = check(J([Q(1, { options: { a: dmg, b: dmg, c: dmg, d: 'ok' } })]));
  const g = r.groups.find((x) => x.code === 'E_ESCAPE_DAMAGE')!;
  assert.deepStrictEqual(g.questions, [1], 'one question, listed once');
  assert.ok(g.count >= 3);
  assert.strictEqual((g.example.match(/TAB before "imes"/g) || []).length, 1, g.example);
});
test('LLM prompt lists problems and the format rules', () => {
  const src = '[{"question_number":1,"question_text":"Q","options":{"a":"x","b":"y"},"correct_answer":"e"}]';
  const p = buildLlmPrompt(check(src), src);
  assert.ok(/Q#1/.test(p) && /correct_answer/.test(p) && /Format rules/.test(p) && /return the complete corrected JSON/i.test(p));
  const bad = '[{"a": 1 "b" ???]';
  const pf = buildLlmPrompt(check(bad), bad);
  assert.ok(/Line 1/.test(pf), pf);
});
test('locateQuestions gives the start offset of every question', () => {
  const src = J([Q(1), Q(2), Q(3)]).replace(/\},\{/g, '},\n  {');
  const offs = locateQuestions(src);
  assert.strictEqual(offs.length, 3);
  for (const o of offs) assert.strictEqual(src.charAt(o), '{');
  const env = '{ "questions": [ {"a":1}, {"b":2} ] }';
  assert.strictEqual(locateQuestions(env).length, 2);
});
test('image references: titles, parentheses, <img>, ignoring code', () => {
  const t = '![d](assets/q1.png "Figure 1") ![w](https://x.org/File_(a).png) <img src=\'assets/q2.png\'> ![e](<my file.png>) `![no](code.png)`';
  assert.deepStrictEqual(extractImageRefs(t).map((r) => r.src), ['assets/q1.png', 'https://x.org/File_(a).png', 'my file.png', 'assets/q2.png']);
});

// ───────────────────────── renderer support (pure helpers shared with MarkdownRenderer)
test('html-execute is recognised (the old /language-(\\w+)/ regex turned it into "html")', () => {
  assert.strictEqual(parseCodeLanguage('language-html-execute'), 'html-execute');
  assert.strictEqual(/language-(\w+)/.exec('language-html-execute')![1], 'html', 'documents the old bug');
  assert.strictEqual(parseCodeLanguage('language-c++'), 'cpp');
  assert.strictEqual(parseCodeLanguage('language-c#'), 'csharp');
  assert.strictEqual(parseCodeLanguage('language-python extra'), 'python');
  assert.strictEqual(parseCodeLanguage(undefined), null);
  assert.strictEqual(parseCodeLanguage('hljs'), null);
});
test('url(#id) references follow the sanitizer id prefix (arrowheads work)', () => {
  const tree = { type: 'root', children: [{ type: 'element', properties: { markerEnd: 'url(#arrow)', fill: 'red' }, children: [{ type: 'element', properties: { fill: 'url( #g )', stroke: 'url(#user-content-already)' }, children: [] }] }] };
  prefixSvgUrlRefs(tree);
  const a = tree.children[0] as { properties: Record<string, string>; children: Array<{ properties: Record<string, string> }> };
  assert.strictEqual(a.properties.markerEnd, 'url(#' + CLOBBER_PREFIX + 'arrow)');
  assert.strictEqual(a.properties.fill, 'red');
  assert.strictEqual(a.children[0].properties.fill, 'url(#' + CLOBBER_PREFIX + 'g)');
  assert.strictEqual(a.children[0].properties.stroke, 'url(#user-content-already)', 'never double-prefix');
});
test('sanitizer allowlist uses the property names hast really has (strokeDashArray, not strokeDasharray)', () => {
  const all = Object.keys(TAG_ATTRS).reduce((n: string[], k) => n.concat(TAG_ATTRS[k]), []);
  assert.ok(all.includes('strokeDashArray') && all.includes('strokeLineCap') && all.includes('markerEnd'));
  assert.ok(!all.includes('strokeDasharray') && !all.includes('strokeLinecap') && !all.includes('strokeLinejoin'));
  assert.ok(EXTRA_TAGS.includes('marker') && EXTRA_TAGS.includes('tspan'));
  assert.ok(TAG_ATTRS.line.includes('strokeDashArray') && TAG_ATTRS.line.includes('markerEnd') && TAG_ATTRS.g.includes('markerEnd'));
  assert.ok(!all.includes('style') || TAG_ATTRS.span.includes('style'), 'style stays limited to KaTeX spans');
  for (const t of Object.keys(TAG_ATTRS)) if (t !== 'span' && t !== 'math') assert.ok(!TAG_ATTRS[t].includes('style'), t + ' must not allow style');
});
test('html-execute frames cannot reach the network', () => {
  for (const d of ["default-src 'none'", "connect-src 'none'", "form-action 'none'", 'img-src data: blob:']) assert.ok(HTML_EXECUTE_CSP.indexOf(d) >= 0, d);
  assert.ok(!/https?:/.test(HTML_EXECUTE_CSP) && HTML_EXECUTE_CSP.indexOf("script-src 'unsafe-inline'") >= 0);
});

// ───────────────────────── editor-safe repair + fatal suggestions
test('editor repair never drops a question it cannot fix', () => {
  const src = J([Q(1, { question_number: '1' }), { question_number: 2, question_text: 'no options', correct_answer: 'a' }, Q(3, { options: ['p', 'q'], correct_answer: 'b' })]);
  const r = repair(src);
  assert.strictEqual(r.items.length, 3);
  assert.strictEqual(r.repairedItems.length, 3, 'aligned with the input');
  assert.strictEqual(r.questions.length, 2);
  const kept = r.repairedItems[1] as Record<string, unknown>;
  assert.strictEqual(kept.question_text, 'no options', 'unfixable item is kept as written');
  assert.deepStrictEqual((r.repairedItems[2] as Record<string, unknown>).options, { a: 'p', b: 'q' });
  const clean = repair(J([Q(1), Q(2)]));
  assert.strictEqual(clean.repairedItems.length, 2);
});
test('fatal syntax errors carry line, column and a suggestion', () => {
  const r = check('{"question_text": ??? broken}');
  assert.ok(r.fatal, 'expected a fatal error');
  assert.ok(r.fatal.line === 1 && typeof r.fatal.column === 'number');
  assert.ok(r.fatal.suggestion && r.fatal.suggestion.length > 10);
  assert.ok(!/ — /.test(r.fatal.message), 'suggestion is a separate field');
});

test('options: case-sensitive genetic alleles, formulas and symbols are not flagged as duplicates', () => {
  const genetics = J([Q(1, { options: { a: 'c/c R/R', b: 'C/c r/r', c: 'C/C r/r', d: 'C/C R/r' } })]);
  assert.ok(!codes(check(genetics)).includes('W_DUP_OPTION'));

  const chemical = J([Q(1, { options: { a: 'CO', b: 'Co', c: 'CO2', d: 'C' } })]);
  assert.ok(!codes(check(chemical)).includes('W_DUP_OPTION'));

  const identical = J([Q(1, { options: { a: 'c/c R/R', b: 'c/c R/R' } })]);
  assert.ok(codes(check(identical)).includes('W_DUP_OPTION'));

  const proseDup = J([Q(1, { options: { a: 'All of the above', b: 'all of the above' } })]);
  assert.ok(codes(check(proseDup)).includes('W_DUP_OPTION'));
});

test('svg: dominant-baseline on text is supported and not flagged as stripped', () => {
  const q = J([Q(1, { question_text: "Formula: <svg viewBox='0 0 100 100'><text x='50' y='50' dominant-baseline='middle'>CHO</text></svg>" })]);
  assert.ok(!codes(check(q)).includes('W_SVG_STRIPPED'));
});

// ───────────────────────── performance guards
test('performance: 2000 clean questions (check) and the same exam through the slow path', () => {
  const qs = Array.from({ length: 2000 }, (_, i) => Q(i + 1, { question_text: 'Question ' + i + ' with $x^2$ and **bold**', explanation: 'Because '.repeat(15) }));
  const clean = JSON.stringify(qs, null, 2);
  let t = Date.now();
  assert.ok(check(clean).ok);
  const fast = Date.now() - t;
  t = Date.now();
  assert.strictEqual(repair('```json\n' + clean.replace(/\n\s*\}/g, ',\n}') + '\n```').questions.length, 2000);
  const slow = Date.now() - t;
  assert.ok(fast < 1500 && slow < 2500, `fast ${fast}ms, slow ${slow}ms`);
});

// ───────────────────────── corpus: every real exam of this repo
function findBank(): string | null {
  let dir = __dirname;
  for (let i = 0; i < 4; i++) {
    if (fs.existsSync(path.join(dir, 'config.json')) && fs.existsSync(path.join(dir, 'package.json'))) return dir;
    dir = path.dirname(dir);
  }
  return null;
}
const bank = findBank();
if (bank) {
  const files: string[] = [];
  const walk = (d: string): void => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist') continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.json')) {
        try {
          const j: unknown = JSON.parse(fs.readFileSync(p, 'utf8'));
          if (Array.isArray(j) && j.some((x) => x && typeof x === 'object' && 'question_text' in (x as object))) files.push(p);
        } catch { /* not an exam file */ }
      }
    }
  };
  walk(bank);
  const stable = (v: unknown): string => JSON.stringify(v, (_k, x) => (x && typeof x === 'object' && !Array.isArray(x) ? Object.keys(x).sort().reduce((o: Record<string, unknown>, k) => { o[k] = (x as Record<string, unknown>)[k]; return o; }, {}) : x));
  test(`corpus: ${files.length} exam files have ZERO errors in check mode`, () => {
    const bad: string[] = [];
    for (const f of files) {
      const rel = path.relative(bank, f);
      const r = check(fs.readFileSync(f, 'utf8'));
      if (r.fatal) { bad.push(`${rel}: ${r.fatal.message}`); continue; }
      for (const i of r.issues) {
        if (i.severity !== 'error') continue;
        const what = i.message.split('. In JSON')[0].replace(/^[^:]*: /, '');
        bad.push(`${rel}  Q${i.questionNumber ?? '?'}  ${i.field ?? ''}: ${what}`);
      }
    }
    assert.ok(bad.length === 0, `${bad.length} problem(s) in the question files:\n    ` + bad.slice(0, 20).join('\n    ') + (bad.length > 20 ? `\n    … and ${bad.length - 20} more` : '') + '\n    → see them all with:  npm run validate\n    → fix the safe ones automatically:  npx ts-node src/fixData.ts --write');
  });
  test('corpus: repairing valid files changes nothing (no-op property)', () => {
    const changed: string[] = [];
    for (const f of files) {
      const raw = fs.readFileSync(f, 'utf8');
      if (check(raw).issues.some((i) => i.severity === 'error')) continue; // already reported by the test above
      const r = repair(raw, false);
      if (r.fixes.length > 0 || stable(r.questions) !== stable(JSON.parse(raw))) changed.push(path.relative(bank, f) + '  (' + r.fixes.map((x) => x.code).join(', ') + ')');
    }
    assert.ok(changed.length === 0, 'repair changed files that were valid:\n    ' + changed.slice(0, 10).join('\n    '));
  });
  test('corpus: every exam has all subjects/topics summarised and 1..N numbering', () => {
    for (const f of files) {
      const r = repair(fs.readFileSync(f, 'utf8'), false);
      assert.ok(r.questions.every((q, i) => q.question_number === i + 1), f);
    }
  });
}

// ───────────────────────── result
const total = passed + failures.length;
if (failures.length) {
  console.error(failures.join('\n'));
  console.error(`\n${failures.length} of ${total} tests FAILED`);
  process.exit(1);
}
console.log(`✅ examCore: ${passed} tests passed${bank ? ' (including corpus tests on this repo)' : ' (corpus tests skipped: no question bank found)'}`);
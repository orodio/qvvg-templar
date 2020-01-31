import {t7l, interleave} from "./templar"

describe("interleave", () => {
  ;[
    [[], [], []],
    [[1], [], [1]],
    [[], [1], []],
    [[1], [2], [1, 2]],
    [
      [1, 2, 3],
      [4, 5, 6],
      [1, 4, 2, 5, 3, 6],
    ],
    [
      [1, 2, 3],
      [4, 5],
      [1, 4, 2, 5, 3],
    ],
  ].forEach(([a, b, c]) => {
    test(`interleave([${a}], [${b}]) -> [${c}]`, () => {
      expect(interleave(a, b)).toStrictEqual(c)
    })
  })
})

const _ = (msg, a, b) => {
  if (b == null) {
    test(msg, () => expect(a).toMatchSnapshot())
  } else {
    test(msg, () => expect(a).toBe(b))
  }
}
const t = v => typeof v

describe("t7l", () => {
  describe("input type vs output type", () => {
    _("t7l`` -> function", t(t7l``))
    _("t71(``) -> function", t(t7l("words")))
    _("t7l(t7l``) -> function", t(t7l(t7l``)))
  })

  describe("no interop", () => {
    _("t7l`abc`() -> 'abc'", t7l`abc`())
    _("t7l('abc')() -> 'abc'", t7l("abc")())
    _("t7l(t7l`abc`)() -> 'abc'", t7l(t7l`abc`)())
  })

  describe("only interop", () => {
    _("t7l`${'abc'}`() -> 'abc'", t7l`${"abc"}`())
    _("t7l(t7l`${'abc'}`)() -> 'abc'", t7l(t7l`${"abc"}`)())
  })

  describe("interop function", () => {
    const o = {a: "abc"}
    _("t7l`${o=>o.a}`(o) -> 'abc'", t7l`${o => o.a}`(o))
    _("t7l(t7l`${o=>o.a}`)(o) -> 'abc'", t7l(t7l`${o => o.a}`)(o))
  })

  describe("interop more t7l", () => {
    const o = {a: "abc"}
    _("t7l`x${t7l`y${o=>o.a}`}`(o) => 'xyabc'", t7l`x${t7l`y${o => o.a}`}`(o))
    _(
      "t7l`x${t7l`y${t7l`z${o=>o.a}`}`}`(o) => 'xyabc'",
      t7l`x${t7l`y${t7l`z${o => o.a}`}`}`(o)
    )
    _(
      "t7l(t7l`x${t7l`y${o => o.a}`}`)(o) -> 'xyabc'",
      t7l(t7l`x${t7l`y${o => o.a}`}`)(o)
    )
  })

  describe("interop nested functions", () => {
    const fn = a => b => c => d => e => f => f.a
    const o = {a: "abc"}
    _("t7l`${fn}`(o) -> 'abc'", t7l`${fn}`(o))
  })
})

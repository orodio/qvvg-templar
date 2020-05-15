import {templar, interleave} from "./templar"

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

describe("templar", () => {
  describe("input type vs output type", () => {
    _("templar`` -> function", t(templar``))
    _("t71(``) -> function", t(templar("words")))
    _("templar(templar``) -> function", t(templar(templar``)))
  })

  describe("no interop", () => {
    _("templar`abc`() -> 'abc'", templar`abc`())
    _("templar('abc')() -> 'abc'", templar("abc")())
    _("templar(templar`abc`)() -> 'abc'", templar(templar`abc`)())
  })

  describe("only interop", () => {
    _("templar`${'abc'}`() -> 'abc'", templar`${"abc"}`())
    _("templar(templar`${'abc'}`)() -> 'abc'", templar(templar`${"abc"}`)())
  })

  describe("interop function", () => {
    const o = {a: "abc"}
    _("templar`${o=>o.a}`(o) -> 'abc'", templar`${o => o.a}`(o))
    _(
      "templar(templar`${o=>o.a}`)(o) -> 'abc'",
      templar(templar`${o => o.a}`)(o)
    )
  })

  describe("interop more templar", () => {
    const o = {a: "abc"}
    _(
      "templar`x${templar`y${o=>o.a}`}`(o) => 'xyabc'",
      templar`x${templar`y${o => o.a}`}`(o)
    )
    _(
      "templar`x${templar`y${templar`z${o=>o.a}`}`}`(o) => 'xyabc'",
      templar`x${templar`y${templar`z${o => o.a}`}`}`(o)
    )
    _(
      "templar(templar`x${templar`y${o => o.a}`}`)(o) -> 'xyabc'",
      templar(templar`x${templar`y${o => o.a}`}`)(o)
    )
  })

  describe("interop nested functions", () => {
    const fn = a => b => c => d => e => f => f.a
    const o = {a: "abc"}
    _("templar`${fn}`(o) -> 'abc'", templar`${fn}`(o))
  })

  describe("templar takes a string", () => {
    const str = "woot woot im a boot"
    _("templar(str)() -> str", templar(str)(), str)
  })

  describe("object can have non string values", () => {
    const data = {a: 1, b: NaN, c: undefined, d: null, e: false, f: true}
    const template = templar`a:${o => o.a}|b:${o => o.b}|c:${o => o.c}|d:${o =>
      o.d}|e:${o => o.e}|f:${o => o.f}`
    _(
      "template(data)",
      template(data),
      "a:1|b:NaN|c:undefined|d:null|e:false|f:true"
    )
  })
})

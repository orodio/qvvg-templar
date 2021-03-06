export const interleave = (a = [], b = [], c = []) => {
  if (!a.length && !b.length) return c
  if (!a.length) return c
  if (!b.length) return [...c, a[0]]

  const [aHead, ...aRest] = a
  const [bHead, ...bRest] = b

  if (aHead !== undefined) c.push(aHead)
  if (bHead !== undefined) c.push(bHead)

  return interleave(aRest, bRest, c)
}

const recApply = d => arg1 => {
  if (typeof arg1 === "function") return recApply(d)(arg1(d))
  return String(arg1)
}

export const templar = (head, ...rest) => {
  if (typeof head === "string") return () => head
  if (Array.isArray(head)) {
    return d =>
      interleave(head, rest.map(recApply(d)))
        .join("")
        .trim()
  }
  return head
}

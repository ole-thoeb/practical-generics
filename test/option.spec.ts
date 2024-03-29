import { describe, expect, it } from "vitest"
import { Option } from "../src/option.solution"

describe("Option.some", () => {
    it("can be called with any value", () => {
        const a: Option<string> = Option.some("Hello, world!")
        const b: Option<number> = Option.some(42)
    })

    it("hasValue is true and has value field", () => {
        const b: Option<number> = Option.some(42)

        expect(b.hasValue).toBe(true)
        if (b.hasValue) {
            expect(b.value).toBe(42)
        }
    })
})

describe("Option.none", () => {
    it("can be assigned to any option", () => {
        const a: Option<string> = Option.none()
        const b: Option<number> = Option.none()
        const c: Option<{}> = Option.none()
    })

    it("hasValue is false", () => {
        expect(Option.none().hasValue).toBe(false)
    })
})

describe("Option.fromNullable", () => {
    it("turns null into None", () => {
        expect(Option.fromNullable(null)).toEqual(Option.none())
    })

    it("turns undefined into None", () => {
        expect(Option.fromNullable(undefined)).toEqual(Option.none())
    })

    it("wraps a non nullable value into a Some", () => {
        expect(Option.fromNullable(0)).toEqual(Option.some(0))
        expect(Option.fromNullable("")).toEqual(Option.some(""))
        expect(Option.fromNullable(false)).toEqual(Option.some(false))
        expect(Option.fromNullable({ a: "AAAA" })).toEqual(Option.some({ a: "AAAA" }))
    })

    it("removes null | undefined from the type", () => {
        const v1 = undefined as string | undefined
        const option1: Option<string> = Option.fromNullable(v1)

        const v2 = 0 as number | null
        const option2: Option<number> = Option.fromNullable(v2)
    })
})

describe("option.unwrapOr", () => {
    it("returns the wrapped value if option is Some", () => {
        expect(Option.some(3).unwrapOr(4)).toEqual(3)
        expect(Option.some(null).unwrapOr("Hello")).toEqual(null)
    })

    it("returns the given default if option is None", () => {
        expect(Option.none().unwrapOr(null)).toEqual(null)
        expect(Option.none().unwrapOr("Hello")).toEqual("Hello")
    })
})

describe("option.map", () => {
    it("transforms the value if the option is some", () => {
        expect(Option.some(3).map(n => n + 4)).toEqual(Option.some(7))
    })

    it("does nothing when passed the identity function", () => {
        const option = Option.some("Hello, world!")
        expect(option.map(x => x)).toEqual(option)
    })

    it("does nothing if the option is none", () => {
        const option: Option<number> = Option.none()
        expect(option.map(n => n + 4)).toEqual(option)
    })
})

describe("option.flatMap", () => {
    it("transforms the value if the option is some", () => {
        expect(Option.some(3).flatMap(n => Option.some(n + 4))).toEqual(Option.some(7))
    })

    it("results in none if the lambda returns none", () => {
        expect(Option.some(4).flatMap(() => Option.none())).toEqual(Option.none())
        expect(Option.none().flatMap(() => Option.none())).toEqual(Option.none())
    })

    it("Option.some is identity", () => {
        const option = Option.some("Hello, world!")
        expect(option.flatMap(Option.some)).toEqual(option)
    })
})

describe("Option.flatten", () => {
    it("does nothing with None", () => {
        expect(Option.flatten(Option.none())).toEqual(Option.none())
    })

    it("unwraps nested Some", () => {
        const someNone = Option.some(Option.none())
        const someSome = Option.some(Option.some(4))
        expect(Option.flatten(someNone)).toEqual(Option.none())
        expect(Option.flatten(someSome)).toEqual(Option.some(4))
    })
})

describe("option.flatten", () => {
    it("does nothing with None", () => {
        expect(Option.none().flatten()).toEqual(Option.none())
    })

    it("unwraps nested Some", () => {
        const someNone = Option.some(Option.none())
        const someSome = Option.some(Option.some(4))
        expect(someNone.flatten()).toEqual(Option.none())
        expect(someSome.flatten()).toEqual(Option.some(4))
    })
})
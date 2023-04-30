import { describe, expect, it } from "vitest"
import { Option } from "../src/option"

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
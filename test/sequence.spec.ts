import { describe, expect, it, vi } from "vitest"
import { Sequence } from "../src/sequence.solution"

function expectIterableContains<T>(iterable: Iterable<T>, ...elements: T[]) {
    let i = 0
    for (const value of iterable) {
        expect(value, `index ${i}`).toEqual(elements[i])
        i++
    }
    expect(i, `iterator must contain ${elements.length} elements`).equal(elements.length)
}

function expectEmptyIterable<T>(iterable: Iterable<T>) {
    expectIterableContains(iterable)
}

describe("Sequence.from", () => {
    it("creates empty sequence if iterator is empty", () => {
        const emptyIterator = [][Symbol.iterator]()
        const sequence = Sequence.from(emptyIterator)
        expectEmptyIterable(sequence)
    })

    it("creates sequence contains elements of iterator", () => {
        const sequence1 = Sequence.from([1, 2, 3, 4, 5][Symbol.iterator]())
        expectIterableContains(sequence1, 1, 2, 3, 4, 5)

        const sequence2 = Sequence.from(new Map([["a", 1], ["b", 2]])[Symbol.iterator]())
        expectIterableContains(sequence2, ["a", 1], ["b", 2])
    })

    it("can be used with sequence.iterator", () => {
        const iterator = [1, 2, 3, 4, 5][Symbol.iterator]()
        const sequence1 = Sequence.from(iterator)
        const sequence2 = Sequence.from(sequence1)
        const sequence3 = Sequence.from(sequence2)
        expectIterableContains(sequence3, 1, 2, 3, 4, 5)
    })
})

describe("Sequence.from", () => {
    it("creates empty sequence if iterable is empty", () => {
        expectEmptyIterable(Sequence.from([]))
        expectEmptyIterable(Sequence.from(new Set()))
        expectEmptyIterable(Sequence.from(new Map()))
    })

    it("creates sequence contains elements of iterable", () => {
        const sequence1 = Sequence.from([1, 2, 3, 4, 5])
        expectIterableContains(sequence1, 1, 2, 3, 4, 5)

        const sequence2 = Sequence.from(new Map([["a", 1], ["b", 2]]))
        expectIterableContains(sequence2, ["a", 1], ["b", 2])
    })

    it("can be used with sequence", () => {
        const sequence1 = Sequence.from([1, 2, 3, 4, 5])
        const sequence2 = Sequence.from(sequence1)
        const sequence3 = Sequence.from(sequence2)
        expectIterableContains(sequence3, 1, 2, 3, 4, 5)
    })
})

describe("Sequence.of", () => {
    it("creates empty sequence no elements given", () => {
        expectEmptyIterable(Sequence.of())
    })

    it("creates sequence that contains given elements", () => {
        expectIterableContains(Sequence.of(1, 2, 3, 4, 5), 1, 2, 3, 4, 5)
        expectIterableContains(Sequence.of("a", "b", "c"), "a", "b", "c")
    })
})

describe("sequence.toArray", () => {
    it("collects the sequence elements into an array", () => {
        expect(Sequence.from(new Map([["a", 1], ["b", 2]])).toArray()).toEqual([["a", 1], ["b", 2]])
        expect(Sequence.of(1, 2, 3, 4, 5).toArray()).toEqual([1, 2, 3, 4, 5])
    })

    it("Sequence.from -> sequence.toArray with array is identity", () => {
        const expectId = <T>(arr: T[]) => {
            expect(Sequence.from(arr).toArray()).toEqual(arr)
        }
        expectId([1, 2, 3, 4])
        expectId(["a", "b", "c"])
        expectId([])
        expectId([["a", 1], ["b", 2]])
    })
})

describe("sequence.first", () => {
    it("returns undefined if the sequence is empty", () => {
        expect(Sequence.of().first()).toBeUndefined()
    })

    it("returns the first element", () => {
        expect(Sequence.of(1, 2, 3).first()).toEqual(1)
        expect(Sequence.from(new Set([3, 2, 1])).first()).toEqual(3)
    })
})

describe("sequence.forEach", () => {
    it("does nothing if the sequence is empty", () => {
        const callback = vi.fn(() => { })
        Sequence.of().forEach(callback)
        expect(callback).toBeCalledTimes(0)
    })

    it("calls the callback for each element with index", () => {
        const elements: Array<[string, number]> = []
        const callback = vi.fn((el: string, index: number) => {
            elements.push([el, index])
        })

        Sequence.of("a", "b", "c", "d").forEach(callback)

        expect(elements).toEqual([["a", 0], ["b", 1], ["c", 2], ["d", 3]])
        expect(callback).toBeCalledTimes(4)
    })
})

describe("sequence.map", () => {
    it("does nothing if the sequence is empty", () => {
        const callback = vi.fn(() => { })
        expectEmptyIterable(Sequence.of().map(callback))
        expect(callback).toBeCalledTimes(0)
    })

    it("transforms each element", () => {
        {
            const callback = vi.fn((_: string, index: number) => index)
            expectIterableContains(Sequence.of("a", "b", "c", "d", "e").map(callback), 0, 1, 2, 3, 4)
            expect(callback).toBeCalledTimes(5)
        }

        {
            const callback = vi.fn((num: number) => num * num)
            expectIterableContains(Sequence.of(1, 2, 3).map(callback), 1, 4, 9)
            expect(callback).toBeCalledTimes(3)
        }
    })

    it("is lazy", () => {
        const callback = vi.fn((_: string, index: number) => index)
        expect(Sequence.of("a", "b", "c", "d", "e").map(callback).first()).toEqual(0)
        expect(callback).toBeCalledTimes(1)
    })
})

describe("sequence.filter", () => {
    it("does nothing if the sequence is empty", () => {
        const predicate = vi.fn(() => false)
        expectEmptyIterable(Sequence.of().filter(predicate))
        expect(predicate).toBeCalledTimes(0)
    })

    it("keeps all elements for which the predicate is true", () => {
        const predicate = vi.fn((n: number) => n % 2 === 0)
        expectIterableContains(Sequence.of(0, 1, 2, 3, 4, 5, 6).filter(predicate), 0, 2, 4, 6)
        expect(predicate).toBeCalledTimes(7)
    })

    it("does nothing if the predicate is always true", () => {
        const predicate = vi.fn(() => true)
        expectIterableContains(Sequence.of("a", "b", "c", "d", "e").filter(predicate), "a", "b", "c", "d", "e")
        expect(predicate).toBeCalledTimes(5)
    })

    it("returns an empty sequence if the predicate is always false", () => {
        const predicate = vi.fn(() => false)
        expectEmptyIterable(Sequence.of("a", "b", "c", "d", "e").filter(predicate))
        expect(predicate).toBeCalledTimes(5)
    })

    it("is lazy", () => {
        const predicate = vi.fn((_, i: number) => i % 2 !== 0)
        expect(Sequence.from("abcde").filter(predicate).first()).toEqual("b")
        expect(predicate).toBeCalledTimes(2)
    })

    it("reduces the considered elements of subsequent operators", () => {
        const predicate = vi.fn((n: number) => n % 2 === 0)
        const mapper = vi.fn((num: number) => num * num)

        expectIterableContains(Sequence.of(1, 2, 3, 4, 5, 6).filter(predicate).map(mapper), 4, 16, 36)
        expect(predicate).toBeCalledTimes(6)
        expect(mapper).toBeCalledTimes(3)
    })
})
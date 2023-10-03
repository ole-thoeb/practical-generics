export interface Sequence<T> extends Iterable<T> {
    map<R>(transform: (element: T, index: number) => R): Sequence<R>;
    filter<S extends T>(predicate: (element: T, index: number) => element is S): Sequence<S>;
    filter(predicate: (element: T, index: number) => boolean): Sequence<T>;
    zip<Z extends Sequence<unknown>[]>(...other: Z): Sequence<[T, ...SequenceElements<Z>]>;
    toArray(): T[];
    toSet(): Set<T>
    toMap<K, V>(this: Sequence<readonly [K, V]>): Map<K, V>
    forEach(action: (element: T, index: number) => void): void;
    first(): T | undefined;
}

export const Sequence = {
    from<T>(iterable: Iterable<T>): Sequence<T> {
        return new IterableSequence(iterable);
    },
    fromArrayLike<T>(arrayLike: ArrayLike<T>): Sequence<T> {
        return new ArrayLikeSequence(arrayLike);
    },
    of<T>(...elements: readonly T[]): Sequence<T> {
        return Sequence.from(elements);
    },
    toMap<K, V>(s: Sequence<readonly [K, V]>): Map<K, V> {
        return s.toMap()
    }
} as const;

abstract class AbstractSequence<T> implements Sequence<T> {
    map<R>(transform: (element: T, index: number) => R): Sequence<R> {
        return new MappingSequence(this, transform);
    }

    filter<S extends T>(predicate: (element: T, index: number) => element is S): Sequence<S> {
        return new FilteringSequence(this, predicate);
    }

    zip<Z extends Sequence<unknown>[]>(...other: Z): Sequence<[T, ...SequenceElements<Z>]> {
        return new ZippingSequence(this, other);
    }

    toArray(): T[] {
        return Array.from(this);
    }

    toSet(): Set<T> {
        return new Set(this)
    }

    toMap<K, V>(this: Sequence<readonly [K, V]>): Map<K, V> {
        return new Map(this)
    }

    forEach(action: (element: T, index: number) => void): void {
        let index = 0;
        for (const element of this) {
            action(element, index++);
        }
    }

    first(): T | undefined {
        for (const element of this) {
            return element;
        }
        return undefined;
    }

    abstract [Symbol.iterator](): Iterator<T>

}

class IterableSequence<T> extends AbstractSequence<T> {

    constructor(private readonly iterable: Iterable<T>) {
        super();
    }

    [Symbol.iterator](): Iterator<T> {
        return this.iterable[Symbol.iterator]();
    }
}

class ArrayLikeSequence<T> extends AbstractSequence<T> {

    constructor(private readonly arrayLike: ArrayLike<T>) {
        super();
        this.arrayLike = arrayLike;
    }

    *[Symbol.iterator](): Iterator<T> {
        for (let i = 0; i < this.arrayLike.length; i++) {
            yield this.arrayLike[i];
        }
    }
}

class MappingSequence<T, R> extends AbstractSequence<R> {

    constructor(private readonly seq: Sequence<T>, private readonly transform: (element: T, index: number) => R) {
        super();
    }

    *[Symbol.iterator](): Iterator<R> {
        let index = 0;
        for (const element of this.seq) {
            yield this.transform(element, index++);
        }
    }
}

class FilteringSequence<T, S extends T> extends AbstractSequence<S> {

    constructor(private readonly seq: Sequence<T>, private readonly predicate: (element: T, index: number) => element is S) {
        super();
    }

    *[Symbol.iterator](): Iterator<S> {
        let index = 0;
        for (const element of this.seq) {
            if (this.predicate(element, index++)) {
                yield element;
            }
        }
    }
}

type SequenceElement<S> = S extends Sequence<infer E> ? E : never;
type SequenceElements<SS> = { [K in keyof SS]: SequenceElement<SS[K]> };

class ZippingSequence<T, Z extends Sequence<unknown>[]> extends AbstractSequence<[T, ...SequenceElements<Z>]> {

    constructor(private readonly firstSeq: Sequence<T>, private readonly remainingSeqs: Z) {
        super();
    }

    *[Symbol.iterator]() {
        const iters = [this.firstSeq[Symbol.iterator](), ...this.remainingSeqs.map((seq) => seq[Symbol.iterator]())];

        while (true) {
            const values = iters.map((iter) => iter.next());
            if (values.every((v) => v.done !== true)) {
                yield values.map((v) => v.value) as [T, ...SequenceElements<Z>];
            } else {
                return;
            }
        }
    }
}
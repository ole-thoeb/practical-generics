class Some<T> {
    readonly hasValue = true
    constructor(readonly value: T) {}

    map<T2>(f: (t: T) => T2): Option<T2> {
        return Option.some(f(this.value))
    }

    flatMap<T2>(f: (t: T) => Option<T2>): Option<T2> {
        return f(this.value)
    }
}

class None {
    readonly hasValue = false

    map<T2>(): Option<T2> {
        return this
    }

    flatMap<T2>(): Option<T2> {
        return this
    }
}

export type Option<T> = Some<T> | None

export const Option = {
    some<T>(t: T): Option<T> {
        return new Some(t)
    },
    none(): Option<never> {
        return new None()
    }
}
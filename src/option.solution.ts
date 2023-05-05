class Some<T> {
    readonly hasValue = true
    constructor(readonly value: T) { }

    unwrapOr(): T {
        return this.value
    }

    map<U>(f: (t: T) => U): Option<U> {
        return Option.some(f(this.value))
    }

    flatMap<U>(f: (t: T) => Option<U>): Option<U> {
        return f(this.value)
    }

    flatten<U>(this: Option<Option<U>>): Option<U> {
        if (this.hasValue) {
            return this.value
        }
        return Option.none()
    }
}

class None {
    readonly hasValue = false

    unwrapOr<U>(defaultValue: U): U {
        return defaultValue
    }

    map<U>(): Option<U> {
        return this
    }

    flatMap<U>(): Option<U> {
        return this
    }

    flatten(): Option<never> {
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
    },
    fromNullable<T>(nullishValue: T): Option<NonNullable<T>> {
        if (nullishValue == null) {
            return Option.none()
        }
        return Option.some(nullishValue)
    },
    flatten<T>(option: Option<Option<T>>): Option<T> {
        return option.flatMap(x => x)
    }
}
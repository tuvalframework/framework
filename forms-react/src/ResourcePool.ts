export class ResourcePool {
    private resourcesKnown: Set<any>
    private resourcesUnused: Set<any>
    constructor() {
        this.resourcesKnown = new Set()
        this.resourcesUnused = new Set()
    }
    add(res) {
        if (this.resourcesKnown.has(res))
            throw new Error("resource already in pool")
        this.resourcesKnown.add(res)
        this.resourcesUnused.add(res)
        return this
    }
    remove(res, force = false) {
        if (!this.resourcesKnown.has(res))
            throw new Error("resource not in pool")
        if (!this.resourcesUnused.has(res) && !force)
            throw new Error("resource still in use")
        this.resourcesKnown.delete(res)
        this.resourcesUnused.delete(res)
        return this
    }
    clear() {
        this.resourcesKnown.clear()
        return this
    }
    has(res) {
        return this.resourcesKnown.has(res)
    }
    size() {
        return this.resourcesKnown.size
    }
    values() {
        return this.resourcesKnown.values()
    }
    forEach(cb) {
        this.resourcesKnown.forEach(cb)
        return this
    }
    acquire(retries = 10, delay = 100) {
        if (this.resourcesKnown.size === 0)
            throw new Error("still no resources in pool")
        return new Promise((resolve, reject) => {
            const take = () => {
                if (this.resourcesUnused.size > 0) {
                    const res = this.resourcesUnused.values().next()
                    this.resourcesUnused.delete(res.value)
                    resolve(res.value)
                }
                else {
                    retries--
                    if (retries < 0)
                        reject(new Error("failed to aquire resource from pool"))
                    else
                        setTimeout(() => { take() }, delay)
                }
            }
            take()
        })
    }
    release(res) {
        if (!this.resourcesKnown.has(res))
            throw new Error("resource not known in pool")
        if (this.resourcesUnused.has(res))
            throw new Error("resource still not used")
        this.resourcesUnused.add(res)
        return this
    }
    used(res) {
        return !this.resourcesUnused.has(res)
    }
    use(cb, retries = 10, delay = 100) {
        return this.acquire(retries, delay).then(async (res) => {
            return cb(res).then((result) => {
                this.release(res)
                return result
            }, (err) => {
                this.release(res)
                throw err
            })
        }, (err) => {
            throw err
        })
    }
    async drain(cb, retries = 10, delay = 100) {
        while (this.size() > 0) {
            await this.acquire(retries, delay).then((res) => {
                return cb(res).then((result) => {
                    this.remove(res, true)
                    return result
                }, (err) => {
                    this.release(res)
                    throw err
                })
            }, (err) => {
                throw err
            })
        }
        return this
    }
}

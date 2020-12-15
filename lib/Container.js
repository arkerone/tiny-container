class Container {
  constructor () {
    this.definitions = new Map()
    this.services = new Map()
  }

  register (name, cls) {
    this.definitions.set(name, cls)
  }

  resolve (name) {
    if (!this.definitions.has(name)) {
      throw new Error(`Unknown service ${name}`)
    }
    if (this.services.has(name)) {
      return this.services.get(name)
    }

    const definition = this.definitions.get(name)
    const service = new definition(this.paramParser())

    this.services.set(name, service)

    return service
  }

  paramParser () {
    return new Proxy(
      {},
      {
        get: (target, name) => {
          return this.resolve(name)
        },
      },
    )
  }
}

module.exports = Container

interface Observer {
  observe: Function
  unobserve: Function
}

type ElementObserverSetting = {
  root: HTMLElement | null
  rootMargin: string
  threshold: number | number[]
}

type ElementObserverCallbacks = {
  onInView: Function,
  onOutView: Function,
}

export default class ElementObserver implements Observer {
  observer: IntersectionObserver
  settings: ElementObserverSetting
  callbacks: ElementObserverCallbacks

  constructor (settings?: Partial<ElementObserverSetting>, callbacks?: Partial<ElementObserverCallbacks>) {
    const defaultSettings: ElementObserverSetting = { root: null, rootMargin: '0px', threshold: 0.05 }
    const defaultCallbacks: ElementObserverCallbacks = { onInView: () => {}, onOutView: () => {} }

    this.settings = { ...defaultSettings, ...settings }
    this.callbacks = { ...defaultCallbacks, ...callbacks }

    this.observer = new IntersectionObserver(this.callback, this.settings)
  }

  callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]
      const defaultOptions = { repeat: false }

      const options = {
        ...defaultOptions,
        repeat: entry.target instanceof HTMLElement ? entry.target.dataset.repeat === 'true' : false
      }

      if (entry.isIntersecting) {
        this.callbacks.onInView()
        if (!options.repeat) {
          observer.unobserve(entry.target)
        }
      } else {
        this.callbacks.onOutView()
      }
    }
  }

  observe (element: HTMLElement | null) {
    if (element) {
      this.observer.observe(element)
    }
    return null
  }

  unobserve (element: HTMLElement | null) {
    if (element) {
      this.observer.unobserve(element)
    }
  }
}

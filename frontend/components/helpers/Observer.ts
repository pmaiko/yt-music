// //
// // import createEvent from '~/assets/js/helpers/create-event'
//
// // Events that fire on observed element
// // const EVENTS = {
// //   INVIEW: 'inview',
// //   OUTVIEW: 'outview'
// // }
//
// interface IntersectionObserverSettings {
//   root?: Element | null
//   rootMargin?: string
//   threshold?: number | number[]
//   repeat: boolean
// }
//
// interface IntersectionObserverEvents {
//   onInview () {}
// }
//
// export default class Observer {
//   observer: IntersectionObserver
//
//   constructor (settings: IntersectionObserverSettings = { root: null, rootMargin: '0px', threshold: 0.05, repeat: false }, events) {
//     this.observer = new IntersectionObserver(callback, settings)
//     const events = {}
//
//     initEvents()
//
//     function callback (entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
//       for (let i = 0; i < entries.length; i++) {
//         const entry = entries[i]
//         const options = {
//           repeat: false
//         }
//
//         Object.assign(options, getDataOptions(entry.target.dataset))
//
//         if (entry.isIntersecting) {
//           entry.target.dispatchEvent(events.INVIEW)
//           if (!options.repeat) observer.unobserve(entry.target)
//         } else {
//           entry.target.dispatchEvent(events.OUTVIEW)
//         }
//       }
//     }
//
//     function getDataOptions (dataset) {
//       return {
//         // add data-observer-repeat='true' for prevent unobserve
//         repeat: dataset.observerRepeat === 'true'
//       }
//     }
//
//     function initEvents () {
//       Object.keys(EVENTS).forEach(eventName => {
//         events[eventName] = createEvent(EVENTS[eventName])
//       })
//     }
//   }
//
//   observe (element: Element) {
//     this.observer.observe(element)
//   }
//
//   unobserve (element: Element) {
//     this.observer.unobserve(element)
//   }
// }

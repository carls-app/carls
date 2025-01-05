/**
 * Polyfill throwIfAborted which is missing in react-native, but ky uses it.
 *
 * @see https://github.com/sindresorhus/ky/issues/588#issuecomment-2256808504
 * @see https://github.com/sindresorhus/ky/issues/659#issuecomment-2519217384
 *
 * AbortSignal is a react-native polyfill.
 * @see https://github.com/facebook/react-native/blob/838d26d7b534133e75c7fa673dfc849b0e64c9d3/packages/react-native/Libraries/Core/setUpXHR.js#L38
 *
 * Unfortunately it does not have a reason.
 * @see https://github.com/tjmehta/fast-abort-controller/blob/42588908035d1512f90e7299a2c70dfb708f9620/src/FastAbortSignal.ts#L39
 */
if (!AbortSignal.prototype.throwIfAborted) {
  AbortSignal.prototype.throwIfAborted = function() {
    if (this.aborted) {
      throw new Error('Aborted')
    }
  }
}

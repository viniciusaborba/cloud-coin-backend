export class AllFieldsRequiredError extends Error {
  constructor () {
    super('All fields required!')
  }
}
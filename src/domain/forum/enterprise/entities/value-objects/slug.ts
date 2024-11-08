export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(slug: string) {
    return new Slug(slug)
  }

  /**
   * Receives a string and normalizes it as a URL slug.
   *
   * Example: "An title example" => "an-title-example"
   *
   * @param text {string}
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // replaces all(/g) whitespaces (\s+) with dashes "-"
      .replace(/[^\w-]+/g, '') // removes all(/g) non(^) words ([\w-]+)
      .replace(/_+/g, '-') // replaces all(/g) underlines(/_+) with dashes "-"
      .replace(/--+/g, '-') // replaces all(/g) double dashes (/--) with one dash "-" (may be caused by the underline replacement)
      .replace(/-$/, '') // removes all(/g) dash(/-) at the end($) of our string (eg.: removing-ending-dash-)

    return new Slug(slugText)
  }
}

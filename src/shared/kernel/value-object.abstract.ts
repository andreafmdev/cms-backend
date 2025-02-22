export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  /**
   * Verifica se due oggetti ValueObject sono uguali
   * @param other - L'altro oggetto ValueObject da confrontare
   * @returns true se i due oggetti sono uguali, altrimenti false
   */
  equals(other?: ValueObject<T>): boolean {
    if (other === null || other === undefined) return false;
    if (!(other instanceof ValueObject)) return false;
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }

  /**
   * Restituisce una copia delle props dell'oggetto
   */
  getProps(): T {
    return Object.freeze({ ...this.props });
  }

 
}

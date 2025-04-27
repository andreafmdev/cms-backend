export abstract class BaseMapper<D, O> {
  abstract toDomain(orm: O): D;
  abstract toPersistence(domain: D): O;
}

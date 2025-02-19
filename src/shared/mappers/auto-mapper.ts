import { plainToInstance } from 'class-transformer';

export abstract class AutoMapper<OrmEntity, DomainEntity> {
  constructor(
    private readonly domainFactory: (data: any) => DomainEntity,
    private readonly ormClass: new (...args: any[]) => OrmEntity,
  ) {}

  toDomain(entity: OrmEntity): DomainEntity {
    return this.domainFactory(entity); // Usa la factory method per istanziare il dominio
  }

  toOrm(domain: DomainEntity): OrmEntity {
    return plainToInstance(this.ormClass, domain);
  }

  toDomainList(entities: OrmEntity[]): DomainEntity[] {
    return entities.map((entity) => this.toDomain(entity));
  }

  toOrmList(domains: DomainEntity[]): OrmEntity[] {
    return domains.map((domain) => this.toOrm(domain));
  }
}

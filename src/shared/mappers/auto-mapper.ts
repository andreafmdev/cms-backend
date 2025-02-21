import { plainToInstance } from 'class-transformer';
export abstract class AutoMapper<OrmEntity, BaseDomainEntity> {
  constructor(
    private readonly domainFactory: (data: any) => BaseDomainEntity,
    private readonly ormClass: new (...args: any[]) => OrmEntity,
  ) {}

  toDomain(entity: OrmEntity): BaseDomainEntity {
    return this.domainFactory(entity); // Usa la factory method per istanziare il dominio
  }

  toOrm(domain: BaseDomainEntity): OrmEntity {
    return plainToInstance(this.ormClass, domain);
  }

  toDomainList(entities: OrmEntity[]): BaseDomainEntity[] {
    return entities.map((entity) => this.toDomain(entity));
  }

  toOrmList(domains: BaseDomainEntity[]): OrmEntity[] {
    return domains.map((domain) => this.toOrm(domain));
  }
}

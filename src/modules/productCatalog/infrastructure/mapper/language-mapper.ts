import { Injectable } from '@nestjs/common';
import { Language } from '@module/productCatalog/domain/entities/language';
import { LanguageOrmEntity } from '@module/productCatalog/infrastructure/entities/language.orm-entity';
import { BaseMapper } from '@base/infrastructure/mapper/base.mapper';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
@Injectable()
export class LanguageMapper extends BaseMapper<Language, LanguageOrmEntity> {
  toDomain(orm: LanguageOrmEntity): Language {
    return Language.reconstitute({
      code: LanguageCode.create(orm.code),
      name: orm.name,
      isActive: orm.isActive,
      isDefault: orm.isDefault,
    });
  }

  toPersistence(domain: Language): LanguageOrmEntity {
    const entity = new LanguageOrmEntity();
    entity.code = domain.getCode().getValue();
    entity.name = domain.getName();
    entity.isActive = domain.getIsActive();
    entity.isDefault = domain.getIsDefault();
    return entity;
  }
}

import { Uuid } from '@shared/value-object/uuid.vo';
import { IntId } from '@shared/value-object/numeric-id.vo';

export interface IBaseRepository<TDomain, IdType = Uuid | IntId> {
  /**
   * Create a new entity
   * @param entity - The entity to create
   * @returns The created entity
   */
  create(entity: TDomain): TDomain; // Crea un'istanza (in memoria)
  /**
   * Save or update an entity
   * @param entity - The entity to save or update
   * @returns The saved or updated entity
   */
  save(entity: TDomain): Promise<TDomain>; // Salva o aggiorna nel DB
  /**
   * Find an entity by ID
   * @param id - The ID of the entity to find
   * @returns The entity if found, otherwise null
   */
  findById(id: IdType): Promise<TDomain | null>; // Trova per ID
  /**
   * Find all entities
   * @returns All entities
   */
  findAll(): Promise<TDomain[]>; // Trova tutti
  /**
   * Remove an entity
   * @param entity - The entity to remove
   */
  remove(entity: TDomain): Promise<void>; // Elimina dal DB
  /**
   * Count entities
   * @param filters - The filters to count the entities
   * @returns The number of entities
   */
  count(filters?: any): Promise<number>; // Conta le entità
  /**
   * Find all entities by a condition
   * @param condition - The condition to find the entities
   * @returns The entities if found, otherwise null
   */
  findAllByCondition(condition?: any): Promise<TDomain[]>; // Trova tutte le entità per una condizione
  /**
   * Find one entity by a condition
   * @param condition - The condition to find the entity
   * @returns The entity if found, otherwise null
   */
  findOneByCondition(condition?: any): Promise<TDomain | null>; // Trova una entità per una condizione
}

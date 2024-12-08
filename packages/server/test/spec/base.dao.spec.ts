import { describe, it, expect } from 'bun:test';
import { BaseDAO } from 'src/base.dao';

interface Employee {
  id: string;
  name: string;
}

const employee: Employee = {
  id: '0000',
  name: 'Foo',
};

const otherEmployee: Employee = {
  id: '0021',
  name: 'Bar',
};

describe('BaseDao', () => {
  describe('find', () => {
    it('should return item', async () => {
      // Given
      const dao = new BaseDAO<Employee, string>();
      await dao.save(employee);

      // When
      const result = await dao.find('0000');

      // Then
      expect(result).toBe(employee);
    });

    it('should return undefined', async () => {
      // Given
      const dao = new BaseDAO<Employee, string>();
      await dao.save(employee);

      // When
      const result = await dao.find('0208');

      // Then
      expect(result).toBeUndefined();
    });
  });

  describe('has', () => {
    it('should return true', async () => {
      // Given
      const dao = new BaseDAO<Employee, string>();
      await dao.save(employee);

      // When
      const result = await dao.has('0000');

      // Then
      expect(result).toBeTrue();
    });

    it('should return false', async () => {
      // Given
      const dao = new BaseDAO<Employee, string>();
      await dao.save(employee);

      // When
      const result = await dao.has('0208');

      // Then
      expect(result).toBeFalse();
    });
  });

  describe('delete', () => {
    it('should return true on known item', async () => {
      // Given
      const dao = new BaseDAO<Employee, string>();
      await dao.save(employee);

      // When
      const result = await dao.delete('0000');

      // Then
      expect(result).toBeTrue();
      expect(await dao.has('0000')).toBeFalse();
    });

    it('should return false on unknown item', async () => {
      // Given
      const dao = new BaseDAO<Employee, string>();
      await dao.save(employee);

      // When
      const result = await dao.delete('0208');

      // Then
      expect(result).toBeFalse();
      expect(await dao.has('0208')).toBeFalse();
    });
  });

  describe('list', () => {
    it('should return empty list', async () => {
      // Given
      const dao = new BaseDAO<Employee, string>();

      // When
      const result = await dao.list();

      // Then
      expect(result).toBeEmpty();
    });

    it('should return all items', async () => {
      // Given
      const dao = new BaseDAO<Employee, string>();
      await dao.save(employee, otherEmployee);

      // When
      const result = await dao.list();

      // Then
      expect(result).toEqual([employee, otherEmployee]);
    });
  });
});

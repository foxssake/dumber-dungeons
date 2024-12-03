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
    it('should return item', () => {
      // Given
      const dao = new BaseDAO<Employee, string>();
      dao.save(employee);

      // When
      const result = dao.find('0000');

      // Then
      expect(result).toBe(employee);
    });

    it('should return undefined', () => {
      // Given
      const dao = new BaseDAO<Employee, string>();
      dao.save(employee);

      // When
      const result = dao.find('0208');

      // Then
      expect(result).toBeUndefined();
    });
  });

  describe('has', () => {
    it('should return true', () => {
      // Given
      const dao = new BaseDAO<Employee, string>();
      dao.save(employee);

      // When
      const result = dao.has('0000');

      // Then
      expect(result).toBeTrue();
    });

    it('should return false', () => {
      // Given
      const dao = new BaseDAO<Employee, string>();
      dao.save(employee);

      // When
      const result = dao.has('0208');

      // Then
      expect(result).toBeFalse();
    });
  });

  describe('delete', () => {
    it('should return true on known item', () => {
      // Given
      const dao = new BaseDAO<Employee, string>();
      dao.save(employee);

      // When
      const result = dao.delete('0000');

      // Then
      expect(result).toBeTrue();
      expect(dao.has('0000')).toBeFalse();
    });

    it('should return false on unknown item', () => {
      // Given
      const dao = new BaseDAO<Employee, string>();
      dao.save(employee);

      // When
      const result = dao.delete('0208');

      // Then
      expect(result).toBeFalse();
      expect(dao.has('0208')).toBeFalse();
    });
  });

  describe('list', () => {
    it('should return empty list', () => {
      // Given
      const dao = new BaseDAO<Employee, string>();

      // When
      const result = dao.list();

      // Then
      expect(result).toBeEmpty();
    });

    it('should return all items', () => {
      // Given
      const dao = new BaseDAO<Employee, string>();
      dao.save(employee, otherEmployee);

      // When
      const result = dao.list();

      // Then
      expect(result).toEqual([employee, otherEmployee]);
    });
  });
});

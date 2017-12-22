import { SelectItem } from './select-item';

describe('class SelectItem', () => {

  describe('should be created', () => {
    it('with null init data', () => {
      expect(new SelectItem(null)).toBeTruthy();
    });

    it('from object with zero id', () => {
      const item = new SelectItem({id: 0, text: 'item'});
      expect(item.id).toBe(0);
      expect(item.text).toBe('item');
    });

    it('from object without id', () => {
      const item = new SelectItem({text: 'item'});
      expect(item.id).toBe('item');
      expect(item.text).toBe('item');
    });

    it('from string', () => {
      const item = new SelectItem('item');
      expect(item.id).toBe('item');
      expect(item.text).toBe('item');
    });
  });

});

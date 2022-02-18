const { HashMap } = require('dsa.js');

describe('HashMap Tests', () => {
    let hashMap;

    beforeEach(() => {
        hashMap = new HashMap();
    });

  describe('Basics demo', () => {
        it('should keep one null key', () => {
            hashMap.set(null, 1);
            hashMap.set(null, 2);
            expect(hashMap.get(null)).toBe(2);
        });

        it('should hold mutliple null values', () => {
            hashMap.set(1, null);
            hashMap.set(2, null);
            expect(hashMap.get(2)).toBe(null);
            expect(hashMap.get(2)).toBe(null);

        })
    })


    describe('#keys', () => {
        it('should get keys', () => {
          hashMap.set(0, 'fool');
          hashMap.set(null, 'fox');
          hashMap.set('a', 'bar');
          hashMap.set({}, 'bus');
    
          const mapIter = hashMap.keys();
    
          expect(mapIter.next().value).toBe(0);
          expect(mapIter.next().value).toBe(null);
          expect(mapIter.next().value).toBe('a');
          expect(mapIter.next().value).toEqual({});
        });
    
        it('should not have holes', () => {
          hashMap.set('0', 'foo');
          hashMap.set(1, 'bar');
          hashMap.set({}, 'bus');
    
          hashMap.delete(1);
    
          expect([...hashMap.keys()]).toEqual(['0', {}]);
        });
      });

})
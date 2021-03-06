import { expect } from 'chai';
import { ch, parseQueryString, stringifyChannelList } from './helpers';

describe('helpers', () => {
  describe('channel template tag', () => {
    it('should wrap a channel in parantheses', () => {
      expect(ch`${12}`).to.equal('(12)');
    });
    it('should allow for a string before', () => {
      expect(ch`the channel is ${12}`).to.equal('the channel is (12)');
    });
    it('should allow for a string after', () => {
      expect(ch`${12} is the channel`).to.equal('(12) is the channel');
    });
    it('should allow for a string before and after', () => {
      expect(ch`channel ${12} is the best`).to.equal(
        'channel (12) is the best'
      );
    });
    it('should convert a null channel to an X', () => {
      expect(ch`channel ${null} is null`).to.equal('channel (X) is null');
    });
  });

  describe('stringifyChannelList', () => {
    it('should convert a range of channels', () => {
      const list = [1, 2, 3, 4, 5];
      expect(stringifyChannelList(list)).to.equal('(1)-(5)');
    });
    it('should convert a range of channels with a gap', () => {
      const list = [1, 2, 4, 5];
      const list2 = [null, 2, 3, 4, 5];
      const list3 = [1, 2, 3, 12, 14, 15, 16];
      const list4 = [1, 2, 3, 12, 15];
      expect(stringifyChannelList(list)).to.equal('(1)-(2), (4)-(5)');
      expect(stringifyChannelList(list2)).to.equal('(X), (2)-(5)');
      expect(stringifyChannelList(list3)).to.equal('(1)-(3), (12), (14)-(16)');
      expect(stringifyChannelList(list4)).to.equal('(1)-(3), (12), (15)');
    });
    it('should convert a range of channels with nulls', () => {
      const list = [null, null, 201, 289];
      expect(stringifyChannelList(list)).to.equal('(X), (201), (289)');
    });
    it('should convert a range of channels with duplicates', () => {
      const list = [201, 201, 202, 202, 204];
      expect(stringifyChannelList(list)).to.equal('(201)-(202), (204)');
    });

    describe('parseQueryString', () => {
      it('should convert a query string to an array', () => {
        const query1 = '1,2,3';
        const query2 = '1-2-3-4';
        const query3 = '1-10, 11-12';
        const query4 = '-$!-1--2,3-4,-';
        const query5 = 'a,b,c';
        const query6 = ',';
        expect(parseQueryString(query1)).to.deep.equal([[1], [2], [3]]);
        expect(parseQueryString(query2)).to.deep.equal([[1, 4]]);
        expect(parseQueryString(query3)).to.deep.equal([
          [1, 10],
          [11, 12],
        ]);
        expect(parseQueryString(query4)).to.deep.equal([
          [1, 2],
          [3, 4],
        ]);
        expect(parseQueryString(query5)).to.deep.equal([['a'], ['b'], ['c']]);
        expect(parseQueryString(query6)).to.deep.equal([]);
      });
    });
  });
});

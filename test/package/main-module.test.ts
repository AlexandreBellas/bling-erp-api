import { Bling } from '../../lib/bling'

jest.setTimeout(50000)

test.concurrent(
  'should fail when an ordinary request is made with a bad API key',
  async () => {
    const bling = new Bling('1234')

    await expect(bling.products().all()).rejects.toThrow(
      'Request failed with status code 401'
    )
  }
)

/**
 * [Class Anagrammes]
 */
export default class MainAnagrammes
{

  public input: string[]
  public word:any;

  constructor (  ) {}

  public tri (word)
  {
    return  word.split("").sort().join('');
  }

  public solve(A)
  {
    this.input = A;
    const anagrammes = {};

    this.input.forEach((value)=> {

      let hash = this.tri(value);
      if(hash in anagrammes)
      {
        return anagrammes[hash].push(value);
      }
      anagrammes[hash] = [value]
    });

    this.sortValue(anagrammes);
  }

  private sortValue( anagrammes:{} ) : any
  {
    const values = Object.keys(anagrammes).map(key => anagrammes[key]);
    console.log(values);
  }

}

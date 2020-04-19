import { Logger } from "../logger";
import chalk from "chalk"
import leven from 'leven';
import _ from 'lodash';

export interface ITrackSearchResult {
  downloadUrl: string
  title: string
  fileName: string
}

export abstract class SearchProvider {
  abstract name: string
  abstract async search(title: string): Promise<ITrackSearchResult[]>
}

function checkSimilarity(string1: string, string2: string) {
  const string1Parts: string[] = string1
    .replace(/[^\w\s]|_/g, '')
    .split(' ')
    .map(n => n.toLowerCase())
    .filter(n => n != '');
  const string2Parts: string[] = string2
    .replace(/[^\w\s]|_/g, '')
    .split(' ')
    .map(n => n.toLowerCase())
    .filter(n => n != '')
    .filter(n => n != 'zippysharecom');

  const itemsInString2 = string2Parts.reduce((acc, item, idx) => {
    return acc + (string1Parts.includes(item) ? 1 : 0);
  }, 0);

  return itemsInString2 / string1Parts.length;
}

export class Searcher {

  providers: SearchProvider[] = []

  registerProvider(provider: SearchProvider) {
    this.providers.push(provider)
  }

  async search(title: string) : Promise<ITrackSearchResult[]> {
    let allResults: ITrackSearchResult[] = []
    for(const provider of this.providers) {
      Logger.log(chalk.cyanBright(`Searching for: ${title} with ${provider.name}`))
      const results = await provider.search(title)
      allResults = allResults.concat(results)
    }
    Logger.log(`\tGot ${allResults.length} results`)
    return allResults
  }

}

interface IRankedTrackSearchResult extends ITrackSearchResult {
  sim: number;
  leven: number;
}

export class Search {

  searchTerm: string = ""
  searcher: Searcher
  results: ITrackSearchResult[] = []

  constructor(searcher: Searcher) {
    this.searcher = searcher
  }

  async search(term: string): Promise<IRankedTrackSearchResult[]> {
    this.searchTerm = term
    this.results = await this.searcher.search(term)
    return this.rankResults()
  }

  rankResults(): IRankedTrackSearchResult[] {
    Logger.log(`\tRanking search results...`)
    let resultsWithRanks: IRankedTrackSearchResult[] = []
    for(const result of this.results) {
      const sim = checkSimilarity(this.searchTerm, result.title)
      const lev = leven(this.searchTerm, result.title)
      Logger.log(`\t\tSimilarity: ${sim} Levenshtein distance: ${lev} - ${result.title} `)
      resultsWithRanks.push({
        ...result,
        sim: sim,
        leven: lev
      })
    }
    const sorted = _.orderBy(resultsWithRanks, ['sim', 'leven'], ['desc', 'asc']);
    const suitable = sorted.filter((res) => {
      return res.sim >= 0.45;
    })
    Logger.log(`\tGot ${suitable.length} suitable results`)
    return suitable
  }

}
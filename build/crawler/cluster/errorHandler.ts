import { Cluster } from 'puppeteer-cluster';
import { Job } from '../../declarations';
import { appendFileSync } from '../../utils';

export function initErrorHandler(cluster: Cluster<Job>) {
  cluster.on('taskerror', (err, { listItem }: Job) => {
    console.log(`[taskerror]: ${err.message}|${JSON.stringify(listItem)}`);

    if (listItem) {
      appendFileSync('build/output/error.json', listItem);
    }
  });
}

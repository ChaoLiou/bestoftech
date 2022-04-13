import { Cluster } from "puppeteer-cluster";
import { Job } from "./declarations";
import { initErrorHandler } from "./errorHandler";

export class ClusterSingleton {
  private static instance: Cluster<Job>;

  private constructor() {}

  public static async getInstance(): Promise<Cluster<Job, any>> {
    if (!ClusterSingleton.instance) {
      ClusterSingleton.instance = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 20,
      });

      initErrorHandler(ClusterSingleton.instance);
    }

    return ClusterSingleton.instance;
  }
}

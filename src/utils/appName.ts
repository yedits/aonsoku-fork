import { repository, version } from '@/../package.json'

export const appName = 'Yedits.net'

export function getAppInfo() {
  return {
    name: appName,
    version,
    url: repository.url,
  }
}

export const lrclibClient = `${appName} v${version} (${repository.url})`

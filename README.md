# node-license-getter
grab the license of the modules which project depencies from package.json

## Usage
`node index [package.json filepath]`


For example, if you execute `node index ../project/someproject/package.json`, it will parse the package.json file, and get dependencies modules and grab the license infomation from https://www.npmjs.com/

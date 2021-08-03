/**
 * ：：爬虫------读写内容
 * ts直接引用js文件是有问题的，可以使用类型定义文件来翻译 
 * ts -> .d.ts 将 js->ts   安装 npm install  @types/superagent -D
 * superagent: 可以直接发送ajax请求读取数据
 * cheerio:可以获取html模板的一个库 npm install cheerio --save,转成ts需要 npm install @types/cheerio -D
 * 
 */
import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import DellAnalyzer from './dellAnalyzer'
// import LeeAnalyzer from './leeAnalyzer'
// import DellAnalyzer from './dellAnalyzer02'


export interface Analyzer {
    analyze: (html: string, filePath: string) => string
}

// 创建爬虫的类
class Crowller {
    // 获取data文件下的文件绝对路径
    private filePath = path.resolve(__dirname, '../../data/data.json');

    // 使用superagent获取html
    private async getRawHtml() {
        const result = await superagent.get(this.url);
        return result.text;
    }

    // 文件写入
    private writeFile(content: string) {
        // 存取爬取的内容
        fs.writeFileSync(this.filePath, content);
    }

    // 降低耦合,整体控制入口
    private async initSpiderProcess() {
        const html = await this.getRawHtml()
        const fileContent = this.analyzer.analyze(html, this.filePath);
        this.writeFile(fileContent)
    }

    // 整个函数的入口
    constructor(private url: string, private analyzer: Analyzer) {
        this.initSpiderProcess();
    }

}

const secret = 'secretKey'
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;

const analyzer = new DellAnalyzer();  //组合模式测试
// const analyzer = DellAnalyzer.getInstance() //单例模式测试
// const analyzer = new LeeAnalyzer(); 获取html测试
new Crowller(url, analyzer);

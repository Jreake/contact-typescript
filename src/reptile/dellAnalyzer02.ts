/***
 * 分析读取的代码信息
 * -----------单例模式---------------
 */
import fs from 'fs';
import cheerio from 'cheerio';
import { Analyzer } from './crowller'

// 定义基础类型
interface JsonBase {
    title: string;
    count: number;
}

// 定义数据结构
interface JsonResult {
    time: number,
    data: JsonBase[]
}

// 定义要存储的数据接口类型
interface Content {
    [propName: number]: JsonBase[];
}


export default class DellAnalyzer implements Analyzer {
    private static instance: DellAnalyzer;

    static getInstance() {
        if (!DellAnalyzer.instance) {
            DellAnalyzer.instance = new DellAnalyzer();
        }
        return DellAnalyzer.instance;
    }


    // 利用cheerio解析html模板
    private getJsonInfo(html: string) {
        const $ = cheerio.load(html);
        // 根据类名获取dom元素
        const jsonItems = $('.course-item');
        const jsonInfors: JsonBase[] = [];
        jsonItems.map((index, element) => {
            // 在每一个json中寻找 course-desc 属性
            const descs = $(element).find('.course-desc');
            // eq ：找到dom中属性第一个dom值 ->标题
            const title = descs.eq(0).text();
            // 获取dom中元素title对应的数量
            const count = parseInt(descs.eq(1).text().split(': ')[1], 10) | 380;
            jsonInfors.push({ title, count })
        });

        // 当前时刻的dom数据信息
        return {
            time: (new Date()).getTime(),
            data: jsonInfors
        }
    }
    // 将json信息存储在data文件目录下
    private generateJsonContent(jsonInfo: JsonResult, filePath: string) {
        /**
         * 判断该路径是否存在
         * 存在：读取文件信息
         * 不存在：创建文件
         * */
        let fileContent: Content = {}
        if (fs.existsSync(filePath)) {
            // 读取已经存储的文件内容
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        }
        // 将新爬到的内容存储到fileContent中
        fileContent[jsonInfo.time] = jsonInfo.data;
        // 将爬取的内容返回
        return fileContent
    }

    public analyze(html: string, filePath: string) {
        const jsonInfo = this.getJsonInfo(html);
        const fileContent = this.generateJsonContent(jsonInfo, filePath);
        return JSON.stringify(fileContent)

    }
    // 单例模式私有化
    private constructor() { }
}
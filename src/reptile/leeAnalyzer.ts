/***
 * 分析读取的代码信息
 *
 */
// 测试直接返回一个html
import { Analyzer } from './crowller'



export default class DellAnalyzer implements Analyzer {
    public analyze(html: string, filePath: string) {
        return html

    }
}
const request = require('request')
const cheerio = require('cheerio')
const debug = require('debug')('fetch:guanggua:app')
const config = require('../../dist/config/index')
const Models = require('../../dist/models/index')
const QuestionModel = Models.QuestionModel
const ReplyModel = Models.ReplyModel

config.mongo()

const HOST = 'moc.auggnaug.www//:ptth'.split('').reverse().join('')

const results = [];

/**
 * 抓取文章列表
 *
 * @param {string} uri uri
 */
const fetchArticles = (uri) => {
  request(uri, (error, res) => {
    if (error) {
      debug('error: ', error);
      return;
    }
    const $ = cheerio.load(res.body.toString())
    const articles = []
    $('#questions .question-summary').each((i, q) => {
      const $self = $(q)
      $title = $self.find('.question-link')
      // debug('title: ', $title.text());
      // debug('href: ', $title.attr('href'))
      const href = $title.attr('href');
      const id = href.match(/\d{5,}/)[0]
      request(HOST + href, (error1, res1) => {

        // 标题
        const _$article = cheerio.load(res1.body.toString())
        const _$titles = _$article('h1.q-title')
        let _titles = ''
        _$titles.each((i, t) => {
          _titles += _$article(t).find('a').text()
        })

        // 内容
        const _$content_ZH = _$article(`.q-${id}-zh`).html()
        const _$content_EN = _$article(`.q-${id}-en`).html()
        const _contents = `<div>
                            ${_$content_ZH}
                            ${_$content_EN}
                           </div>`

        // 标签
        const _$tags = _$article('.q-tag')
        const _tags = []
        _$tags.each((i, g) => {
          _tags.push(_$article(g).text())
        })

        const _$replies = _$article('.answer-cell')
        const _replies = []
        _$replies.each((i, r) => {
          const _$r = _$article(r)
          const _$reply_ZH = _$r.find(`.a-zh`).html()
          const _$reply_EN = _$r.find(`.a-en`).html()
          if (!_$reply_ZH) {
            return;
          }
          _replies.push({
            content: `<div>
                        ${_$reply_ZH}
                        ${_$reply_EN}
                      </div>`,
            userId: '5a5a23c5e2c22386a00f1d24',
            createAt: new Date(_$r.find('.creationDate').text().substr(5)),
          })
        })

        // results.push({
        //   title: _titles,
        //   content: _contents,
        // })
        // 保存数据
        new QuestionModel({
          title: _titles,
          description: _contents,
          userId: '5a5a23c5e2c22386a00f1d24',
          tags: _tags,
          createAt: new Date()
        }).save((error, question) => {
          if (_replies.length === 0) {
            return;
          }
          ReplyModel.create(_replies.map(r => ({
            ...r,
            questionId: question.id,
          })), (err, res) => {
            // 不处理
          })
        })
      })
    })

    // 下一个页面
    const $next = $('a.next')
    if ($next.hasClass('disable')) {
      // debug('结果: ', results)

      return;
    }
    fetchArticles(HOST + $next.attr('href'))
  })
}

fetchArticles(HOST);

# 现有文章事实一致性清单

检查日期：2026-11-23 · 基于 main `270d7da` · 范围：`articles/` 78 篇、根目录页面、`projects/`、`js/main.js`

本清单只列出问题，**未修改任何页面**。每项需 Sam 确认正确数字后再改。
优先级：🔴 事实错误或互相矛盾 · 🟠 数字不一致 · 🟡 需重新核实 / 规则问题

---

## A. 外国人购买门槛与费用

全站主流说法：Johor 外国人一般门槛 **RM1 million**；部分获批新项目可低于此（如 RM600,000 起）；Medini 与 Forest City 另有安排。以下页面与此冲突：

| # | 优先 | 页面 | 现在写的 | 问题 |
|---|---|---|---|---|
| A1 | 🔴 | `articles/horizon-hills-vs-eco-botanic-vs-east-ledang.html` | "Also suits foreign buyers (above RM 2M threshold)" | 门槛写成 RM2M，与全站 RM1M 矛盾。这是近3个月有50次点击的比较文章 |
| A2 | 🔴 | `articles/iskandar-puteri-landed-property-guide-2026.html` | 前段 "RM 1 million per unit for landed"；后段 "the RM 2 million floor still applies" 及 "RM 2 million threshold is the operative constraint" | 同一篇文章前后自相矛盾 |
| A3 | 🔴 | `articles/jb-condo-vs-landed-investment-2026.html` | "can buy strata condominiums above RM 1 million **without state approval**" | 外国人购买一般仍须州政府批准（全站其他文章都这样写）；同篇表格还写 condo "Straightforward"、landed "Requires state approval"。应改为两者都需批准 |
| A4 | 🟡 | `articles/medini-iskandar-2026.html` | "the rest of Johor required foreigners to buy at RM 500K or above" | 若指旧时期，须写明年份，否则读者会以为是现行门槛 |
| A5 | 🟡 | `articles/foreign-buyer-costs-johor-property-2026.html` | 8% 转让印花税；Johor 3% 批准费，最低 RM30,000；RM2,000 申请费；RM1M 例子合计 RM112,000 | 内部计算一致。3% / RM30,000 / RM2,000 需按最新州政府收费再核一次（请律师或私下资料确认，不放链接） |

**建议统一写法（待 Sam 确认）：** "Johor's general minimum for foreign buyers is RM1 million; selected approved new projects may allow lower prices, and Medini/Forest City follow separate arrangements. State consent is required in all cases."

---

## B. 项目价格

| # | 优先 | 项目 | 各页面写法 | 问题 |
|---|---|---|---|---|
| B1 | 🟠 | Riveria Garden @ Wawari | `projects.html` 卡片："From RM 900K" · `js/main.js` 及项目页："Terrace from RM 1M · Cluster from RM 1.5M" · `is-ascent-park-overpriced…`："Around RM900k–RM1M" | 三种起价。Wawari 是最大流量来源，须用最新价单统一 |
| B2 | 🟠 | Forest City High-Rise | `projects/forest-city-high-rise.html`："RM577,252 – RM2,697,700" · `is-forest-city-worth-buying-2026`："about RM400,000 to RM1.5 million" · `forest-city-highrise-living-2026`："from RM500k" · CLAUDE.md："RM 400K–1.5M" | 四种范围；worth-buying 是第3大流量文章 |
| B3 | 🟡 | Ascent Park | 项目页 / main.js："25×60 from RM1.155M · 25×70 from RM1.353M" · review 文中多次写 "RM1.1 million" · overpriced 文标题 "RM1.3 Million" | 大致一致（四舍五入），但 review 的 "RM1.1 million" 建议改为 "about RM1.16 million"。全部须对照最新价单 |
| B4 | 🟡 | Summer Suites | "RM620,000 – RM1,068,000"，完工 June 2029 | 各页一致，起稿②前再确认价单 |
| B5 | 🟡 | Horizon Hills | main.js "Subsale from RM 1M"；cluster 文 "RM1.6M–RM1.7M" | 类型不同，未见矛盾；用真实放盘复核 |
| B6 | 🟡 | CLAUDE.md 项目表 | 仍列 eco-botanic、east-ledang 项目及价格 | 这两个项目页已于 11-20 删除并 301。CLAUDE.md 需更新（属内部文件，不影响读者） |

---

## C. RTS 通车时间与通勤

计划资料称官方目标为 **2027年2月**，并须安全认证及监管批准（请 Sam 私下核实后再统一）。现有写法有四种：

| # | 优先 | 页面 | 现在写的 |
|---|---|---|---|
| C1 | 🔴 | `articles/foreign-buyer-guide-johor-property.html` | "targeted to begin passenger operations around the end of December 2026" |
| C2 | 🔴 | `articles/foreign-buyer-ciq-rts-condo-checklist.html` | "officially scheduled to begin operations on 1 January 2027" |
| C3 | 🔴 | `articles/rf-princess-cove-phase-3-good-buy.html` | "officially scheduled to begin operations on 1 January 2027" |
| C3b | 🔴 | `articles/walk-to-ciq-vs-walk-to-rts-jb-condo.html` | "The official schedule is for passenger operations to begin on 1 January 2027. As at 1 October 2026…" |
| C4 | 🟠 | `articles/rts-link-testing-johor-bahru-property-2026.html` | "Completion … end of 2026, public operations around the beginning of 2027" |
| C5 | 🟡 | `articles.html`、`jb-town-rental-market-population`、`bodaiju-residences`、`js-sez-…-property-guide`、`malaysian-working-singapore-…` | "opens in 2027" / "operational from 2027" — 若目标为2027年2月，这些可保留 |

**建议统一写法：** "The RTS Link is targeted to begin passenger service in early 2027 (currently February 2027), subject to safety certification and regulatory approval."

其他通勤数字：

| # | 优先 | 页面 | 问题 |
|---|---|---|---|
| C6 | 🟠 | `js-sez-johor-singapore-special-economic-zone-property-guide` 写 "a 5-minute rail journey"；`jb-town-rental-market-population` 写 "6 minutes travel time from Woodlands North to JB Bukit Chagar" | 统一为同一数字 |
| C7 | 🟠 | `projects/summer-suites.html` | "covered walkway … within 850 metres, while JB CIQ is approximately 1.0 km away. JB City Square is about 2.4 km away" — City Square 就在 CIQ / JB Sentral 旁，CIQ 1.0 km 却 City Square 2.4 km 不合理。须用实际路线核对 |
| C8 | 🟡 | Second Link 车程 | Horizon/Eco/East 比较 15–30 分钟；landed guide 15–25 分钟；Forest City ~30 分钟。大致一致，无须改 |
| C9 | 🟡 | CTC SkyOne "~300m to RTS"、Aethera "about 400 metres" | 均注明为项目资料，写法谨慎，可保留 |

---

## D. 规则9：文章头部显示月份 — ✅ 已于 2026-11-23 修正

共 35 篇已改为只显示 `2026`（含下列 33 篇，另加 `js-sez-johor-singapore-special-economic-zone-property-guide` 与 `mm2h-malaysia-2026-complete-guide` 的 "Updated July 2026" → "Updated 2026"）。原清单：

July 2026（20篇）：foreign-buyer-guide-johor-property · horizon-hills-resale-vs-new-launch-2026 · is-sunway-city-iskandar-puteri-worth-buying-2026 · jb-condo-vs-landed-investment-2026 · malaysian-working-singapore-buy-jb-town-or-iskandar-puteri · retiree-checklist-buying-johor-property · rf-princess-cove-phase-3-good-buy · riveria-garden-wawari-ksl-worth-buying · schools-sunway-city-iskandar-puteri-families · second-link-sunway-city-vs-forest-city · signature-home-sunway-city-iskandar-puteri · singaporean-buying-property-jb-guide · summer-suites-jb-dual-key-investment · sunway-city-iskandar-puteri-greenest-township · sunway-city-iskandar-puteri-js-sez-investors · sunway-city-iskandar-puteri-retirees-guide · sunway-city-iskandar-puteri-township-explained · sunway-city-vs-horizon-hills-vs-eco-botanic · sunway-international-school-iskandar-puteri · who-should-buy-landed-iskandar-puteri

August 2026：foreign-buyer-costs-johor-property-2026

September 2026：can-singaporeans-retire-in-johor-bahru · estuari-township-iskandar-puteri-guide · foreign-buyer-ciq-rts-condo-checklist · horizon-hills-cluster-new-vs-subsale-2026 · horizon-mall-horizon-hills-property-prices · iskandar-puteri-landed-property-by-budget-2026 · jb-1-bedroom-vs-2-plus-1-bedroom-guide · rf-princess-cove-ciq-buyer-guide · rts-link-testing-johor-bahru-property-2026 · the-kews-iskandar-puteri-landed-near-second-link

带日期：is-ascent-park-overpriced-estuari-ksl-riveria（25 September 2026）· walk-to-ciq-vs-walk-to-rts-jb-condo（30 September 2026）

注意：结构化数据里的 `datePublished` / `dateModified` 是机器读取字段，不在规则9范围内，保留不动。

---

## F. 规则10：正文中的第三方链接 — ✅ 已于 2026-11-23 修正（v4.14）

第三方链接全部改为纯文字来源；LPEPH 改为文字写出网址 lpeph.gov.my。Sam 本人名下的页面（PropertyGuru 代理页、YouTube、Facebook）可以保留链接 — About Sam 与 Horizon Hills cluster 文章的 PropertyGuru 链接已恢复（v4.15），CLAUDE.md 规则10 已同步更新。原清单：

规则10禁止在公开文章中链接政府、发展商、新闻、房产网站等。以下链接仍在正文中（Sam 自己的 Facebook / YouTube / WhatsApp 不算）：

| 页面 | 链接 |
|---|---|
| `can-singaporeans-retire-in-johor-bahru` | mm2h.gov.my · moh.gov.my（医院列表）· motac.gov.my（MM2H 条款） |
| `foreign-buyer-costs-johor-property-2026` | belanjawan.mof.gov.my（预算 PDF）· ptj.johor.gov.my（收费）· hasil.gov.my（Finance Act 2025 PDF） |
| `horizon-mall-horizon-hills-property-prices` | gamudaland.com.my ×2 · horizonhills.com.my |
| `iskandar-puteri-healthcare-hospitals` | enanyang.my（新闻）· ihhhealthcare.com · sunwayhealthcaregroup.com |
| `verify-property-agent-malaysia` | lpeph.gov.my ×2 |
| `horizon-hills-cluster-new-vs-subsale-2026` | propertyguru.com.my（Sam 自己的代理页面） |

---

## G. 从别人服务器加载的图片（待换成自己的照片）

读者看不到链接，但图片是直接从别的网站拿的。对方删图或改名，页面会出现空白；部分还有版权风险。

### 🔴 优先替换：项目/发展商或第三方网站的照片（版权风险）

| 页面 | 来源 | 数量 | 内容 | 建议 |
|---|---|---|---|---|
| R&F Princess Cove 项目页（`js/main.js` 第1145–1152行，`/project?slug=rf-princess-cove` 及项目卡片） | rfmalaysia.com（发展商官网） | 7 张（封面 1 + 图库 6） | 外观、海景/城市景、整体规划、RTS 连接图、泳池、健身房 | 用 Sam 现场拍摄：外观、景观、泳池、健身房、往 CIQ 的步行路线 |
| `articles/forest-city-golf-course-guide.html`（每张出现两次：图库及正文） | golflux.com（高尔夫网站） | 4 张 | Legacy Course ×2、Classic Course ×2 | 用 Sam 自己在 Forest City 球场拍的照片 |

### 🟡 次要：Unsplash 免费图库（可合法使用，但属通用图片、非 JB 实景）

| 位置 | 用途 |
|---|---|
| `iskandar-puteri.html`、`jb-town.html` | 地区页主图（hero） |
| `articles.html` 文章卡片（9 张）及 `js/main.js` 文章/项目卡片 | 卡片缩图 |
| 文章主图：`bandar-wawari-future-development…`（2 张）、`foreign-buyer-costs-johor-property-2026`、`foreign-buyer-guide-johor-property`、`iskandar-puteri-property-price-outlook-2026`、`jb-condo-vs-landed-investment-2026`、`js-sez-johor-singapore-special-economic-zone-property-guide`（3 张）、`malaysian-working-singapore-buy-jb-town-or-iskandar-puteri`、`mm2h-malaysia-2026-complete-guide`（2 张）、`retiree-checklist-buying-johor-property`、`singaporean-buying-property-jb-guide` | 文章封面或内文配图 |

建议：地区页主图先换（Iskandar Puteri、JB Town 是重要入口），可用 `photos/` 里已有的实景照片。

另：`js/main-v3.98.js` 是旧版 JS，仍被 9 个页面引用，里面也有同样的 rfmalaysia / Unsplash 图片。替换时两边都要改，或把这 9 页统一改用 `js/main.js`。

另发现：`js/main.js` R&F 项目资料写 "RTS Link is separately scheduled for service from 1 January 2027"，属 C 段 RTS 日期问题，一并更新。

---

## E. 发布记录

- `LATEST_ARTICLE.md` 仍记 Forest City MM2H（2026-10-21）。实际最新为 `/articles/iskandar-puteri-healthcare-hospitals`，下一篇前须更新。

---

## 修改时的注意事项

- 修改发生在观察期内：只改正文事实与头部月份，**不要**改 title、meta description、URL 或内链结构，以免干扰 11-20 改动的观察。
- 每处修改须同步 EN/ZH 两个版本。
- 数字来源只作私下核实，不在正文或结构化数据中放外部链接（规则10）。

## 需要 Sam 提供 / 确认

1. 外国人门槛统一写法（A 段建议句）是否正确，Medini/Forest City 例外如何表述
2. Riveria Garden 最新起价（Terrace / Cluster）
3. Forest City High-Rise 你目前可卖的价格范围
4. Ascent Park 最新价单
5. RTS 官方最新目标日期（是否确为 2027年2月）
6. Summer Suites 到 CIQ / City Square 的实际步行路线距离

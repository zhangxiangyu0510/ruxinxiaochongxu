//=====dev环境=======
// const ApiRootUrl = 'https://myshop-dev.cn.nuskin.com/api/nuskin-myshop-shopkeeper/myshop-dev/nuskin-myshop-shopkeeper/';
// const ApiRootUrlUser = 'https://myshop-dev.cn.nuskin.com/api/nuskin-myshop-user/myshop-dev/nuskin-myshop-user/';
//=====dev环境=======
//=====qa环境=======
// const ApiRootUrl = 'https://myshop-test.cn.nuskin.com/api/nuskin-myshop-shopkeeper/myshop-test/nuskin-myshop-shopkeeper/';
// const ApiRootUrlUser = 'https://myshop-test.cn.nuskin.com/api/nuskin-myshop-user/myshop-test/nuskin-myshop-user/';
//=====qa环境=======
//=====stage环境=======
const ApiRootUrl = 'https://myshop-stage.cn.nuskin.com/api/nuskin-myshop-shopkeeper/myshop-stage/nuskin-myshop-shopkeeper/';
const ApiRootUrlUser = 'https://myshop-stage.cn.nuskin.com/api/nuskin-myshop-user/myshop-stage/nuskin-myshop-user/';
//=====stage环境=======
//=====prod环境=======
// const ApiRootUrl = 'https://myshop.cn.nuskin.com/api/nuskin-myshop-shopkeeper/myshop-prod/nuskin-myshop-shopkeeper/';
// const ApiRootUrlUser = 'https://myshop.cn.nuskin.com/api/nuskin-myshop-user/myshop-prod/nuskin-myshop-user/';
//=====prod环境=======


module.exports = {
    //获取token
    getToken: ApiRootUrl + 'login/login_wechat',
    //h5商城token
    getH5Token: ApiRootUrl + 'h5/get_shop_token',
    //我的订单--数量提示弹窗
    getOrderStatusCount: ApiRootUrl + 'shopKeeper/order/orderStatusCount',
    //微信一键登录
    AuthLoginByWeixin: ApiRootUrl + 'login/login',
    //发送订阅消息
    sendMessage: ApiRootUrl + 'subscribe_message/send',
    //获取顾客是否在线
    getOnlineStatus: ApiRootUrl + 'subscribe_message/online_status',
    //获取顾客失效的EN悦家点数
    getVirtualCoins: ApiRootUrl + 'shopkeeperUser/getVirtualCoins',
    //客服电话
    customerService: ApiRootUrl + 'config/official_telephone',
    //获取图形证码
    getPhoneImgCode: ApiRootUrl + 'login/graphic',
    //获取手机验证码
    getPhoneCode: ApiRootUrl + 'login/shot_message_code',
    //协议(用户已登录)
    getProtocols: ApiRootUrl + 'member_term/list',
    //协议(用户未登录)
    // 条款协议列表
    getTermList: ApiRootUrl + "shop/getClauseManageList",
    getTermdetails: ApiRootUrl + "shop/getClauseDetail",
    getNewTermdetails: ApiRootUrl + `shop/getPrivateClause`,
    getNoLoginProtocols: ApiRootUrl + 'member_term/list_not_login',
    //保存协议(用户已登录)
    saveProtocols: ApiRootUrl + 'member_term/save',
    //店主端查询顾客列表
    getCustomerList: ApiRootUrl + 'shopkeeperUser/getShopkeeperCustomer',
    //店主端顾客详情
    getCustomerDetail: ApiRootUrl + 'shopkeeperUser/getCustomer',
    //顾客列表模糊查询
    getCustomerBySearch: ApiRootUrl + 'shopkeeperUser/getCustomerBySearch',
    //顾客列表标签
    getTagList: ApiRootUrl + 'shopkeeper-tag/list',
    //获取 banner
    getBanner: ApiRootUrl + 'shopkeeper/banner/list',
    //获取公告
    getNotice: ApiRootUrl + 'communique/list',
    //公告详情
    getNoticeDetail: ApiRootUrl + 'communique/detail/',
    //重点顾客
    getCustomerFocus: ApiRootUrl + 'shopkeeperUser/getShopkeeperKeyCustomer',
    //店主端个人信息
    getShopInfo: ApiRootUrl + 'shop',
    //店主端店主en点数
    getSelfEnNumber: ApiRootUrl + 'shopkeeperUser/getSelfEnNumber',
    // 个人信息编辑
    putUserInfo: ApiRootUrl + 'bp',
    //店主端顾客订单列表
    getOrderList: ApiRootUrl + 'shopkeeperUser/getUserDetailOrderList',
    //根据用户获取如新NU币信息
    getNucoinDetail: ApiRootUrl + 'nucoin/detail',
    //获取即将过期Nu币列表
    getExpireRecord: ApiRootUrl + 'nucoin/expireRecord',
    //获取NU币(已生效或扣减)Nu币列表
    getNucoinRecord: ApiRootUrl + 'nucoin/record',
    //获取待生效Nu币列表
    getWaitRecord: ApiRootUrl + 'nucoin/waitRecord',
    //获取店铺等级
    getShopLevel: ApiRootUrl + 'shop_level',
    //店主端顾客订单详情
    getOrderDetail: ApiRootUrl + 'shopkeeperUser/getOrderDetail',
    //获取顾客标签
    getTagValues: ApiRootUrl + 'shopkeeperTag/getTagValues',
    //获取标签下所有顾客
    getTagValueUsers: ApiRootUrl + 'shopkeeperTag/getTagValueUsers',
    //顾客详情删除标签
    delUserTagValue: ApiRootUrl + 'shopkeeperTag/delUserTagValue',
    //批量给此标签添加用户
    batchSaveUserTagValue: ApiRootUrl + 'shopkeeperTag/batchSaveUserTagValueByTageVaue',
    //批量给此用户添加标签
    batchSaveUserTagValueByUser: ApiRootUrl + 'shopkeeperTag/batchSaveUserTagValueByUser',
    //粉丝列表
    fansList: ApiRootUrl + 'fans/get/fans',
    //店铺排名
    getShopOrder: ApiRootUrl + 'shop_order/list',
    //季度查询
    getQuarter: ApiRootUrl + 'shop_order/quarter',
    //省份
    getProvince: ApiRootUrl + 'shop_order/province',
    // 店铺排名排序条件显示标记
    getSortShow: ApiRootUrl + 'shop_order/sort_show',
    // 工作台店铺入口显示与否
    getShow: ApiRootUrl + 'shop_order/show',
    ///获取所有点亮的徽章
    getBadge: ApiRootUrl + 'badge',
    //获取所有徽章
    getBadgeAll: ApiRootUrl + 'badge/all',
    //获取最后点亮的徽章
    getLastLighting: ApiRootUrl + 'badge/last_lighting',
    //获取组合推荐列表
    gitHybridRecommendLsitAll: ApiRootUrl + 'combRecommendation/all',
    // 组合推荐排序
    HybridRecommendsort: ApiRootUrl + 'combRecommendation/sort',
    //提交推荐
    HybridRecommendDetail: ApiRootUrl + 'combRecommendation',
    // 头像上传
    UploadAvatar: ApiRootUrl + 'cos',
    // 获取分类一级目录
    shopkeeperClassify: ApiRootUrl + 'shopkeeper/product/classify',
    //根据一级分类查询二级分类
    shopkeeperChildren: ApiRootUrl + 'shopkeeper/product/children/classify',
    //根据二级类目id查询产品列表
    shopkeeperList: ApiRootUrl + 'shopkeeper/product/list',
    // 产品分类搜索
    shopkeeperSearch: ApiRootUrl + 'shopkeeper/product/search',
    //获取已推荐列表
    recommendationList: ApiRootUrl + 'shopkeeper/recommendation/list',
    //获取取消推荐列表/
    outRecommendation: ApiRootUrl + 'shopkeeper/recommendation/cancel/list',
    //批量修改推荐shopkeeper/recommendation/batch/update
    updateRecommendation: ApiRootUrl + 'shopkeeper/recommendation/batch/update',
    //删除已取消推荐
    deleteCancleRecommend: ApiRootUrl + 'shopkeeper/recommendation/',
    //批量推荐/shopkeeper/recommendation/batch/recommend
    recommend: ApiRootUrl + 'shopkeeper/recommendation/batch/recommend',
    //重新推荐
    againRecommend: ApiRootUrl + 'shopkeeper/recommendation/recommend/again',
    //取消推荐
    cancleRecommend: ApiRootUrl + 'shopkeeper/recommendation/cancel',
    //完成新手指南或者tips
    tipsGuideDone: ApiRootUrl + 'novice/guide/done',
    //是否需要新手引导
    isTipsGuide: ApiRootUrl + 'novice/guide/get/recommendation',
    // 店铺分享
    shareShop: ApiRootUrl + 'share/shop',
    // 产品分享
    shareProduct: ApiRootUrl + 'share/product',
    // 组合产品分享
    shareCombProduct: ApiRootUrl + 'share/combProduct',
    //官方推荐
    recommendationAll: ApiRootUrl + 'shopkeeper/recommendation/all',
    optimizationDetail: ApiRootUrl + 'combRecommendation/',
    //店铺换肤列表
    skinList: ApiRootUrl + 'skin/getSkinList',
    //皮肤详情
    getSkinDetail: ApiRootUrl + 'skin/getSkinDetail',
    //皮肤预览
    previewDetail: ApiRootUrl + 'skin/previewSkin',
    //更新皮肤
    updateSkin: ApiRootUrl + 'skin/updateSkin',
    //获取默认皮肤
    getSkin: ApiRootUrl + 'skin/getTopicColor',



    //获取店铺信息/
    getShopConfig: ApiRootUrl + 'shop/get_config',
    //设置店铺信息/
    setShopConfig: ApiRootUrl + 'shop/set_config',



    //用户分析
    //访客分析
    visitor: ApiRootUrl + 'user_analysis/userAnalysisViewerTypeRealtime',
    //粉丝类型
    fansType: ApiRootUrl + 'user_analysis/userAnalysisFansTypeRealtime',
    //总浏览次数分析
    broswerAll: ApiRootUrl + 'user_analysis/userAnalysisViewerTimesRealtime',
    //访客用户明细
    visitorList: ApiRootUrl + 'user_analysis/userAnalysisViewerDetailRealtime',
    //粉丝类型GET/user_analysis/userAnalysisFansDetailRealtime
    getfansList: ApiRootUrl + 'user_analysis/userAnalysisViewerDetailRealtime',
    //店铺浏览明细
    shopPerson: ApiRootUrl + 'user_analysis/userAnalysisShopViewerDetailRealtime',
    //商品浏览明细
    goodsPerson: ApiRootUrl + 'user_analysis/userAnalysisItemViewerDetailRealtime',
    //顾客消费情况/
    customerSale: ApiRootUrl + 'customer_analysis/adsUserStatisticsTotalSales',
    //各省份消费情况
    areaSale: ApiRootUrl + 'customer_analysis/adsUserStatisticsProvinceSales',
    //采购为下单及首次购买商品
    addNoPayAndfirstSales: ApiRootUrl + 'customer_analysis/adsUserStatisticsAddCartFirstSales',
    //加购未下单产品列
    addNoPayGoods: ApiRootUrl + 'customer_analysis/adsUserStatisticsAddCartNotPayItems',
    //加购未下单用户
    addNoPayUser: ApiRootUrl + 'customer_analysis/adsUserStatisticsAddcartNotPayUser',
    //首次购买商品列表/
    // firstGoods: ApiRootUrl + 'customer_analysis/adsUserStatisticsFirstItems',



    // 店铺分析---月购买人数图表数据查询
    shopAnalysisBuyer_info: ApiRootUrl + 'shop_analysis/buyer_info',
    // 店铺分析---月新关注粉丝图表数据查询
    shopAnalysisFans_info: ApiRootUrl + 'shop_analysis/fans_info',
    // 店铺分析---列表查询
    shopAnalysisList: ApiRootUrl + 'shop_analysis/list',
    // 店铺分析---月新增粉丝列表查询
    shopAnalysisNew_fans_info: ApiRootUrl + 'shop_analysis/new_fans_info',
    // 店铺分析---订单列表查询
    shopAnalysisOrder_info: ApiRootUrl + 'shop_analysis/order_info',
    // 店铺分析---月购买人数列表查询
    shopAnalysisShop_buyer_info: ApiRootUrl + 'shop_analysis/shop_buyer_info',
    // 商品分析-根据产品编号查询购买顾客列表
    productAnalysisBuyer_list: ApiRootUrl + 'product_analysis/buyer_list',
    // 商品分析-列表查询
    productAnalysisList: ApiRootUrl + 'product_analysis/list',
    // 商品分析-根据会员用户id查询加购未下单产品列表
    productAnalysisProduct_list: ApiRootUrl + 'product_analysis/product_list',
    ///构建兑吧免登录接口地址
    nu_login: ApiRootUrl + 'duiba/autoLogin',
    // Nu币获取明细
    adsNucoinAnalysisIncomeRealtime: ApiRootUrl + 'nucoin_analysis/adsNucoinAnalysisIncomeRealtime',
    // Nu币汇总情况
    adsNucoinAnalysisSalesUserRealtime: ApiRootUrl + 'nucoin_analysis/adsNucoinAnalysisSalesUserRealtime',
    // Nu币消耗明细
    adsNucoinAnalysisUsedRealtime: ApiRootUrl + 'nucoin_analysis/adsNucoinAnalysisUsedRealtime',
    firstGoods: ApiRootUrl + 'customer_analysis/adsUserStatisticsFirstItems',
    //顾客消费明细
    payDetailUserList: ApiRootUrl + 'customer_analysis/adsUserStatisticsUserType',
    //用户消费偏好/
    userHobby: ApiRootUrl + 'customer_analysis/adsuUserStatisticsCategoryHobby',
    //用户消费产品/customer_analysis/adsUserStatisticsUserItem
    payGoods: ApiRootUrl + 'customer_analysis/adsUserStatisticsUserItem',

    //商品加购用户明细
    goodsUserList: ApiRootUrl + 'customer_analysis/adsUserStatisticsAddCartNotPayItemUsers',
    //加购用户商品明细/
    userGoodsList: ApiRootUrl + 'customer_analysis/adsUserStatisticsAddCartNotPayUserItem',
    //顾客详情--订单统计
    getUserDetailByTime: ApiRootUrl + 'shop_analysis/getUserOrderAds',
    //获取订单统计数据

    orderData: ApiRootUrl + 'customer_analysis/getShopOrderAds',
    ///获取所有点亮的徽章
    badgeLight: ApiRootUrl + 'badge',
    // 取消推荐列表
    combinationList: ApiRootUrl + 'combRecommendation/status',

    ApiRootUrl: ApiRootUrl,
    // 记录粉丝
    chatLastTime: ApiRootUrl + 'shopkeeperUser/record/chat/lastTime',


    optimizationAll: ApiRootUrlUser + 'optimization/all',
    //banner列表
    bannerList: ApiRootUrlUser + 'user/banner/list',
    // 店主推荐
    recommendation: ApiRootUrlUser + 'user/recommendation/list',




    // shopAnalysisShop_buyer_info: ApiRootUrl + 'shop_analysis/shop_buyer_info'

};
/**
 * sessionStorage 和 localStorage 的2此封装
 * @param {string} type 存储方式：sessionStorage、localStorage
 * @returns {function} storage
 */
class Storage {
    memory: any;
    constructor(type: string) {
        if (type === "localStorage") {
        this.memory = window.localStorage;
        } else {
        this.memory = window.sessionStorage;
        }
    }

    /**
     * 设置缓存
     * @param {object} params
     * key: 键、value: 值、expired: 过期时间
     */
    setItem(params: {}) {
        const defaultOParams = {
        key: "",
        value: "",
        expired: "",
        startTime: new Date().getTime(), //记录何时将值存入缓存，毫秒级
        };

        //将obj和传进来的params合并
        const options = {
        ...defaultOParams,
        ...params,
        };

        // 设置失效时间
        if (options.expired) {
        //如果options.expired 设置了的话
        //以options.key为key，options为值放进去
        this.memory.setItem(options.key, JSON.stringify(options));
        } else {
        //如果options.expired 没有设置，就判断一下value的类型
        const type = Object.prototype.toString.call(options.value);
        //如果value是对象或者数组对象的类型，就先用JSON.stringify转一下，再存进去
        if (type === "[object Object]" || type === "[object Array]") {
            options.value = JSON.stringify(options.value);
        }
        this.memory.setItem(options.key, options.value);
        }
    }

    /**
     * 取值
     * @param {string} key 键
     */
    getItem(key: string) {
        let item = this.memory.getItem(key);
        if (!item || item == "null" || item == "undefined") {
        return "";
        }

        //先将拿到的试着进行json转为对象的形式
        try {
        item = JSON.parse(item);
        } catch (error) {
        //如果不行就不是json的字符串，就直接返回
        item = item;
        }

        //如果有startTime的值，说明设置了失效时间
        if (item.startTime) {
        const now = new Date().getTime();
        //何时将值取出减去刚存入的时间，与item.expires比较，如果大于就是过期了，如果小于或等于就还没过期
        if (now - item.startTime > item.expired) {
            //缓存过期，清除缓存，返回false
            this.memory.removeItem(key);
            return "";
        } else {
            //缓存未过期，返回值
            return item.value;
        }
        } else {
        //如果没有设置失效时间，直接返回值
        return item;
        }
    }

    /**
     * 移除缓存
     * @param {string} key 键
     */
    removeItem(key: string) {
        this.memory.removeItem(key);
    }

    /**
     * 移除全部缓存
     * @param {string} key 键
     */
    clear() {
        this.memory.clear();
    }
}

/**
 * 词典表缓存
 *
 * @class Lexicon
 */
class Lexicon {
    stores: Storage;
    constructor() {
        this.stores = new Storage("localStorage");
    }

    /**
     * 获取 国
     *
     * @param {boolean} [forceLocal=true] 默认强制获取本地缓存
     * @returns {Array}
     * @memberof Lexicon
     */
    async getCountry(forceLocal = true) {
        const region = this.stores.getItem("countryJson");

        // 有缓存返回缓存;
        if (forceLocal && region) {
        return region;
        }

        const country = await getCountryList();

        const nCountry = Object.values(country);

        // 缓存 国 一级
        this.stores.setItem({
        key: "countryJson",
        value: nCountry,
        expired: 24 * 60 * 60 * 1000, // 过期时间 24 小时
        });

        return nCountry;
    }

    /**
     * 获取所有城市
     *
     * @param {boolean} [forceLocal=true] 默认强制获取本地缓存
     * @returns {Array}
     * @memberof Lexicon
     */
    async getRegion(forceLocal = true) {
        const region = this.stores.getItem("regionJson");

        // 有缓存返回缓存;
        if (forceLocal && region) {
        return region;
        }

        const country = await this.getCountry();

        const res = await getAllLocation();

        let city: any[] = [];

        const list = Object.values(res).map((item: any) => {
        const cityList = Object.values(item.cityList);
        city = [...city, ...cityList];
        return {
            children: cityList,
            cname: item.cname,
            ename: item.ename,
            id: item.id,
            l: item.l,
            n: item.n,
            p_id: item.p_id,
            tname: item.tname,
        };
        });

        // 缓存 国 省 市 一级
        this.stores.setItem({
        key: "regionJson",
        value: [...country, ...list],
        expired: 24 * 60 * 60 * 1000, // 过期时间 24 小时
        });

        // 缓存 市 一级
        this.stores.setItem({
        key: "cityJson",
        value: city,
        expired: 24 * 60 * 60 * 1000, // 过期时间 24 小时
        });

        return [...country, ...list];
    }

    /**
     * 获取职位
     *
     * @param {boolean} [forceLocal=true]
     * @returns {Array}
     * @memberof Lexicon
     */
    async getCategory(forceLocal = true) {
        const category = this.stores.getItem("categoryJson");

        const locale = {
        "zh-CN": 0,
        "zh-TN": 1,
        "zh-EN": 2,
        };

        // 有缓存返回缓存;
        if (forceLocal && category) {
        return category[locale["zh-CN"]];
        }

        const res = await getCategory();

        const list = Object.values(res);

        const arr: any = list[locale["zh-CN"]];

        const nArr = this.__flat(arr);

        this.stores.setItem({
        key: "categoryJson",
        value: list,
        expired: 24 * 60 * 60 * 1000, // 过期时间 24 小时
        });

        this.stores.setItem({
        key: "categoryOpenJson",
        value: nArr,
        expired: 24 * 60 * 60 * 1000, // 过期时间 24 小时
        });

        return list[locale["zh-CN"]];
    }

    /**
     * 获取热门城市
     *
     * @param {boolean} [forceLocal=true]
     * @returns {Array}
     * @memberof Lexicon
     */
    async getHotCity(forceLocal = true) {
        const hotRegion = this.stores.getItem("hotRegionJson");

        // 有缓存返回缓存
        if (forceLocal && hotRegion) {
        return hotRegion;
        }

        const country = await this.getCountry();

        const nCcountry = country.map((item: any) => {
        return {
            ...item,
            id: item.id + "",
        };
        });

        const res = await getHotCity();

        const list = Object.values(res);

        const nList = list.map((item: any) => {
        return {
            id: item.id + "",
            cname: item.cname,
            ename: item.ename,
            tname: item.tname,
            l: item.l,
            n: item.n,
            p_id: item.p_id,
        };
        });

        this.stores.setItem({
        key: "hotRegionJson",
        value: [...nCcountry, ...nList],
        expired: 24 * 60 * 60 * 1000, // 过期时间 24 小时
        });

        return [...nCcountry, ...nList];
    }

    /**
     * 获取行业
     *
     * @param {boolean} [forceLocal=true]
     * @returns {Array}
     * @memberof Lexicon
     */
    async getIndustries(forceLocal = true) {
        const industry = this.stores.getItem("industriesJson");

        // 有缓存返回缓存;
        if (forceLocal && industry) {
        return industry;
        }

        const list = await getCascaderIndustries();

        const nList = list.map((item: any) => {
        return {
            ...item,
            id: item.id + "",
        };
        });

        this.stores.setItem({
        key: "industriesJson",
        value: nList,
        expired: 24 * 60 * 60 * 1000, // 过期时间 24 小时
        });

        return nList;
    }

    /**
     * 获取技术栈列表
     *
     * @param {boolean} [forceLocal=true]
     * @returns {Array}
     * @memberof Lexicon
     */
    async getTechnologyStack(forceLocal = true) {
        const industry = this.stores.getItem("technologyStackJson");

        // 有缓存返回缓存;
        if (forceLocal && industry) {
        return industry;
        }

        const list = await getTechnologyStack();

        this.stores.setItem({
        key: "technologyStackJson",
        value: list,
        expired: 24 * 60 * 60 * 1000, // 过期时间 24 小时
        });

        return list;
    }

    __flat(arr: []) {
        if (!Array.isArray(arr)) return;

        let n: any[] = [];

        const nArr = arr.map((item: any) => {
            if (item.children) {
                n = [...n, ...item.children];
            }

            return {
                categoryId: item.categoryId,
                id: item.id,
                language: item.language,
                name: item.name,
                pid: item.pid,
                skillDetails: item.skillDetails,
            };
        });

        return [...nArr, ...n];
    }
}

/**
 * 存储和读取缓存
 *
 * @class Sx
 * @extends {Lexicon}
 */
class Sx extends Lexicon {
    sessionMemory: Storage;
    localMemory: Storage;
    constructor() {
        super();

        this.sessionMemory = new Storage("sessionStorage");
        this.localMemory = new Storage("localStorage");
    }

    /**
     * 读取 AuthToken
     *
     * @returns {string}
     * @memberof Sx
     */
    getAuthToken(): string {
        return this.localMemory.getItem("authToken");
    }

    /**
     * 存储 AuthToken
     *
     * @param {string} token
     * @memberof Sx
     */
    setAuthToken(token: string) {
        this.localMemory.setItem({
        key: "authToken",
        value: token,
        expired: 24 * 60 * 60 * 1000, // 过期时间 24 小时
        });
    }

    getAuthUserid(): string {
        return this.localMemory.getItem("authUserid");
    }

    setAuthUserid(token: string) {
        this.localMemory.setItem({
        key: "authUserid",
        value: token,
        expired: 24 * 60 * 60 * 1000, // 过期时间 24 小时
        });
    }

    /**
     * 读取缓存
     *
     * @param {string} key 键
     * @param {boolean} forceLocal 是否读取 localStorage 中的缓存
     */
    get(key: string, forceLocal: boolean = false) {
        let ret = this.sessionMemory.getItem(key);
        if (forceLocal) {
        ret = this.localMemory.getItem(key);
        }
        return ret;
    }

    /**
     * 存储缓存
     *
     * @param {string} key 键
     * @param {string | {} | []} value 值
     * @param {boolean} forceLocal 是否存入 localStorage
     */
    set(key: string | {}, value: string | {} | [], forceLocal: boolean = false) {
        this.sessionMemory.setItem({
        key,
        value,
        });

        if (forceLocal) {
        this.localMemory.setItem({
            key,
            value,
        });
        }
    }

    /**
     * 清楚单个缓存
     *
     * @param {string} key 键
     * @param {boolean} forceLocal 是否删除 localStorage 中的缓存
     */
    delete(key: string, forceLocal: boolean = false) {
        this.sessionMemory.removeItem(key);
        if (forceLocal) {
        this.localMemory.removeItem(key);
        }
    }

    /**
     * 清楚所有缓存
     *
     * @param {boolean} forceLocal 是否删除 localStorage 中的缓存
     */
    deleteAll(forceLocal: boolean = false) {
        this.sessionMemory.clear();
        if (forceLocal) {
        this.localMemory.clear();
        }
    }
}

const S = new Sx();

export default S;
      
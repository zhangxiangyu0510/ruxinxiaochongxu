// packageRecommend/components/ColumnChart/ColumnChart.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {

        onInitChart(F2: any, config:any) {
            const chart = new F2.Chart(config);
            var Global = F2.Global;
            const data = [
                { country: '巴西', population: 182 }, 
                { country: '印尼', population: 230 },
                { country: '美国', population: 290 }, 
                { country: '印度', population: 104 }, 
                { country: '中国', population: 131 },
                { country: '韓國', population: 100 }
              ];
            
              chart.source(data, {
                population: {
                  tickCount: 6
                }
              });
              chart.legend(false);
              chart.coord({
                transposed: true
              });
              chart.axis('country', {
                line: Global._defaultAxis.line,
                grid: null
              });
              chart.axis('population', {
                line: null,
                grid: Global._defaultAxis.grid
              });
              chart.interval().position('country*population').color('country',['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0']);
              chart.render();
              
              return chart;
          }
    },
    lifetimes:{
        ready(){
            // this.init()
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        init(){
            const query = wx.createSelectorQuery().in(this);
            query.select('.myCanvas').node().exec(res=>{
                console.log(res,"-------------");
                const canvas = res[0].node
                const ctx = canvas.getContext('2d')
                let ctxWidth = canvas._width;
                let ctxHeight = canvas._height;
                // 开始位置
                let initSpaceY = 40
                let initSpaceX = 40
                let gridSize = 40;
                init()
                function init(){
                    console.log(ctxWidth,ctxHeight);
                    drow()
                }
                function drow (){
                    // ctx.strokeStyle = '#eee';
                    let yLineTotal = Math.floor(ctxWidth / gridSize);
                    for(let i = 0;i<=yLineTotal;i++){
                        ctx.beginPath()
                        ctx.moveTo(initSpaceY+i * gridSize - 0.5,0)
                        ctx.lineTo(initSpaceY+i * gridSize - 0.5,ctxHeight-initSpaceX)
                        ctx.stroke()
                    }
                }
                

            });
        }
    }
})

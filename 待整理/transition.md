
## transition

transition:
- transition-property -- 应用过渡的 CSS 属性的名称
- transition-duration -- 过渡效果花费的时间，默认0
- transition-timing-function -- 过渡效果的时间曲线，默认 ease
- transition-delay -- 过渡效果何时开始，默认0

```css
/* property name | duration | timing-function | delay */
transition: margin-right 4s ease-in-out 1s;
```

### transition-property

应用过渡的 CSS 属性的名称

- none
- all
- property

```css
transition-property: none;
transition-property: all;
transition-property: width;
```

### transition-duration

过渡效果花费的时间，默认0

- time 默认0

```css
transition-duration: 0s; /* 默认 */
transition-duration: 1000ms;
transition-duration: 1s;
```

### transition-timing-function

过渡效果的时间曲线，默认 ease

- linear -- 以相同速度开始至结束的过渡效果（等于 cubic-bezier(0,0,1,1)）
- ease -- 慢速开始，然后变快，然后慢速结束的过渡效果（cubic-bezier(0.25,0.1,0.25,1)）
- ease-in -- 规定以慢速开始的过渡效果（等于 cubic-bezier(0.42,0,1,1)）
- ease-out -- 规定以慢速结束的过渡效果（等于 cubic-bezier(0,0,0.58,1)）
- ease-in-out -- 规定以慢速开始和结束的过渡效果（等于 cubic-bezier(0.42,0,0.58,1)）
- cubic-bezier(*n*,*n*,*n*,*n*) -- 在 cubic-bezier 函数中定义自己的值。可能的值是 0 至 1 之间的数值

```css
transition-timing-function: linear;
transition-timing-function: ease;
transition-timing-function: ease-in;
transition-timing-function: ease-out;
transition-timing-function: ease-in-out;
transition-timing-function: cubic-bezier(n, n, n, n);
```


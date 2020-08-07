# CSS

## background

### background-image

```css
/*单个背景图片*/
background-image: (bgImg1);
/*多个背景图片*/
background-image: (bgImg1), (bgImg2), (bgImg3)... ;
/* TODO bgImg的规则 */
```

绘制背景图像的时候，会在z方向进行堆叠，最先指定的在上，后指定的在下。
border在最上方，background-color在最下方。
若指定图像无法被绘制，会为none。
如果设置了多张背景图片，而背景图片样式设置的数量不足，则超出的图片按设置的第一个样式绘制。

### background-repeat

```css
/*单个背景重复规则*/
{
	background-repeat: (repeatRule);
}
/*多个个背景重复规则*/
{
	background-repeat: (repeatRule1), (repeatRule2), (repeatRule3);
}
/*
 * repeatRule1 => (x方向 y方向)
 * 简写对比
 * repeat    ==  repeat repeat
 * repeat-x  ==  repeat no-repeat
 * repeat-y  ==  no-repeat repeat
 * space     ==  space space
 * round     ==  round round
 * no-repeat ==  no-repeat no-repeat
 */
```

repeatRule(参数): 

- repeat  按背景图片本身设定的宽高进行重复，覆盖整个背景所在区域，不适应div的宽高，超出的会被裁剪

- space 按背景图片本身设定的宽高进行重复，覆盖整个背景所在区域，适应div的宽高，空白填充

- round 自适应拉伸背景图片的宽高，覆盖整个背景所在区域，适应div的宽高

- no-repeat 不重复

- repeat-x

- repeat-y

**example:**

![](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/md_css_background_repeat.png)

### background-size

### background-position

### background-color

### background-clip

### background-attachment

### background-origin

### background



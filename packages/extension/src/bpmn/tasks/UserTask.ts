import { h, RectNode, RectNodeModel } from '@logicflow/core'
import { getBpmnId } from '../getBpmnId'

export class UserTaskModel extends RectNodeModel {
  static extendKey = 'UserTaskModel'

  constructor(data, graphModel) {
    if (!data.id) {
      data.id = `Activity_${getBpmnId()}`
    }
    super(data, graphModel)
  }
}

export class UserTaskView extends RectNode {
  static extendKey = 'UserTaskNode'

  getLabelShape(): h.JSX.Element {
    const { model } = this.props
    const { x, y, width, height } = model
    const style = model.getNodeStyle()
    return h(
      'svg',
      {
        x: x - width / 2 + 5,
        y: y - height / 2 + 5,
        width: 25,
        height: 25,
        viewBox: '0 0 1274 1024',
      },
      h('path', {
        fill: style.stroke,
        d: 'M655.807326 287.35973m-223.989415 0a218.879 218.879 0 1 0 447.978829 0 218.879 218.879 0 1 0-447.978829 0ZM1039.955839 895.482975c-0.490184-212.177424-172.287821-384.030443-384.148513-384.030443-211.862739 0-383.660376 171.85302-384.15056 384.030443L1039.955839 895.482975z',
      }),
    )
  }

  getShape(): h.JSX.Element {
    const { model } = this.props
    const { x, y, width, height, radius } = model
    const style = model.getNodeStyle()
    // todo: 将basic-shape对外暴露，在这里可以直接用。现在纯手写有点麻烦。
    return h('g', {}, [
      h('rect', {
        ...style,
        x: x - width / 2,
        y: y - height / 2,
        rx: radius,
        ry: radius,
        width,
        height,
      }),
      this.getLabelShape(),
    ])
  }
}

export const UserTask = {
  type: 'bpmn:userTask',
  view: UserTaskView,
  model: UserTaskModel,
}

export default UserTask

import { forEach, map } from 'lodash-es'
import LogicFlow, { ElementState, LogicFlowUtil } from '@logicflow/core'
import '@logicflow/core/es/index.css'

import { Button, Card, Divider, Flex } from 'antd'
import { useEffect, useRef } from 'react'
import { combine, square, star, uml, user } from './nodes'
import { animation, connection } from './edges'

import styles from './index.less'
import GraphConfigData = LogicFlow.GraphConfigData

const config: Partial<LogicFlow.Options> = {
  isSilentMode: false,
  stopScrollGraph: true,
  stopZoomGraph: true,
  style: {
    rect: {
      rx: 5,
      ry: 5,
      strokeWidth: 2,
    },
    circle: {
      fill: '#f5f5f5',
      stroke: '#666',
    },
    ellipse: {
      fill: '#dae8fc',
      stroke: '#6c8ebf',
    },
    polygon: {
      fill: '#d5e8d4',
      stroke: '#82b366',
    },
    diamond: {
      fill: '#ffe6cc',
      stroke: '#d79b00',
    },
    text: {
      color: '#b85450',
      fontSize: 12,
    },
  },
}

const customTheme: Partial<LogicFlow.Theme> = {
  baseNode: {
    stroke: '#4E93F5',
  },
  nodeText: {
    overflowMode: 'ellipsis',
    lineHeight: 1.5,
    fontSize: 13,
  },
  edgeText: {
    overflowMode: 'ellipsis',
    lineHeight: 1.5,
    fontSize: 13,
    textWidth: 100,
  }, // 确认 textWidth 是否必传
  polyline: {
    stroke: 'red',
  },
  rect: {
    width: 200,
    height: 40,
  },
  arrow: {
    offset: 4, // 箭头长度
    verticalLength: 2, // 箭头垂直于边的距离
  },
}
const data = {
  nodes: [
    {
      id: 'custom-node-1',
      rotate: 1.1722738811284763,
      text: {
        x: 600,
        y: 200,
        value: 'xxxxx',
      },
      type: 'rect',
      x: 600,
      y: 200,
    },
  ],
}

export default function BasicNode() {
  const lfRef = useRef<LogicFlow>()
  const containerRef = useRef<HTMLDivElement>(null)

  const registerElements = (lf: LogicFlow) => {
    const elements = [
      // edges
      animation,
      connection,
      // nodes
      combine,
      square,
      star,
      uml,
      user,
    ]

    map(elements, (customElement) => {
      lf.register(customElement)
    })
  }
  const registerEvents = (lf: LogicFlow) => {
    lf.on('history:change', () => {
      const data = lf.getGraphData()
      console.log('history:change', data)
    })
  }

  useEffect(() => {
    if (!lfRef.current) {
      const lf = new LogicFlow({
        ...config,
        container: containerRef.current as HTMLElement,
        // hideAnchors: true,
        // width: 1200,
        height: 400,
        // adjustNodePosition: false,
        // isSilentMode: true,
        // overlapMode: 1,
        // hoverOutline: false,
        // nodeSelectedOutline: false,
        multipleSelectKey: 'shift',
        disabledTools: ['multipleSelect'],
        autoExpand: true,
        // metaKeyMultipleSelected: false,
        // adjustEdgeMiddle: true,
        // stopMoveGraph: true,
        adjustEdgeStartAndEnd: true,
        // adjustEdge: false,
        allowRotation: true,
        edgeTextEdit: true,
        keyboard: {
          enabled: true,
          // shortcuts: [
          //   {
          //     keys: ["backspace"],
          //     callback: () => {
          //       const r = window.confirm("确定要删除吗？");
          //       if (r) {
          //         const elements = lf.getSelectElements(true);
          //         lf.clearSelectElements();
          //         elements.edges.forEach((edge) => lf.deleteEdge(edge.id));
          //         elements.nodes.forEach((node) => lf.deleteNode(node.id));
          //         const graphData = lf.getGraphData()
          //         console.log(42, graphData, graphData.nodes.length)
          //       }
          //       // console.log(1)
          //     }
          //   }
          // ]
        },
        partial: true,
        background: {
          color: '#FFFFFF',
        },
        grid: true,
        edgeTextDraggable: true,
        edgeType: 'bezier',
        style: {
          inputText: {
            background: 'black',
            color: 'white',
          },
        },
        // 全局自定义id
        // edgeGenerator: (sourceNode, targetNode, currentEdge) => {
        //   // 起始节点类型 rect 时使用 自定义的边 custom-edge
        //   if (sourceNode.type === 'rect') return 'bezier'
        //   if (currentEdge) return currentEdge.type
        //   return 'polyline'
        // },
        idGenerator(type) {
          return type + '_' + Math.random()
        },
      })

      lf.setTheme(customTheme)
      // 注册节点 or 边
      registerElements(lf)
      // 注册事件
      registerEvents(lf)

      lf.render(data)
      lfRef.current = lf
      ;(window as any).lf = lf
    }
  }, [])

  const setArrow = (arrowName: string) => {
    const lf = lfRef.current
    if (lf) {
      const { edges } = lf.getSelectElements()
      edges.forEach(({ id, properties }) => {
        console.log(4444, properties)
        lf.setProperties(id, {
          arrowType: arrowName,
        })
      })
    }
  }

  const focusOn = () => {
    lfRef?.current?.focusOn({
      id: 'custom-node-1',
    })
  }

  const handleChangeNodeType = () => {
    const lf = lfRef.current
    if (lf) {
      const { nodes } = lf.getSelectElements()
      nodes.forEach(({ id, type }) => {
        lf.setNodeType(id, type === 'rect' ? 'star' : 'rect')
      })
    }
  }

  const handleChangeEditConfig = () => {
    const isSilentMode = lfRef.current?.options.isSilentMode
    lfRef?.current?.updateEditConfig({
      isSilentMode: !isSilentMode,
    })
  }

  const handleCancelEdit = () =>
    lfRef?.current?.graphModel.textEditElement?.setElementState(
      ElementState.DEFAULT,
    )

  const handleChangeId = () => {
    const lf = lfRef.current
    if (lf) {
      const { edges } = lf.getSelectElements()
      edges.forEach(({ id }) => {
        lf.setEdgeId(id, 'newId')
      })
    }
  }

  const handleRefreshGraph = () => {
    const lf = lfRef.current
    if (lf) {
      const data = lf.getGraphData()
      console.log('current graph data', data)
      const refreshData = LogicFlowUtil.refreshGraphId(data)
      console.log('after refresh graphId', data)
      lf.render(refreshData)
    }
  }

  const handleActiveElements = () => {
    const lf = lfRef.current
    if (lf) {
      const { nodes, edges } = lf.getSelectElements()
      nodes.forEach(({ id }) => {
        lf.setProperties(id, {
          isHovered: true,
        })
      })
      edges.forEach(({ id }) => {
        lf.setProperties(id, {
          isHovered: true,
        })
      })
    }
  }

  const handleTurnAnimationOn = () => {
    if (lfRef.current) {
      const { edges } = lfRef.current.getGraphData() as GraphConfigData
      forEach(edges, (edge) => {
        lfRef.current?.openEdgeAnimation(edge.id)
      })
    }
  }
  const handleTurnAnimationOff = () => {
    if (lfRef.current) {
      const { edges } = lfRef.current.getGraphData() as GraphConfigData
      forEach(edges, (edge) => {
        lfRef.current?.closeEdgeAnimation(edge.id)
      })
    }
  }

  const handleDragRect = () => {
    lfRef?.current?.dnd.startDrag({
      type: 'rect',
      text: 'xxxxx',
    })
  }
  const handleDragCircle = () => {
    lfRef?.current?.dnd.startDrag({
      type: 'circle',
      r: 25,
    })
  }
  const handleDragText = () => {
    lfRef?.current?.dnd.startDrag({
      type: 'text',
      text: '文本',
    })
  }

  return (
    <Card title="Graph">
      <Flex wrap="wrap" gap="small">
        <Button key="arrow1" type="primary" onClick={() => setArrow('half')}>
          箭头 1
        </Button>
        <Button key="arrow2" type="primary" onClick={() => setArrow('empty')}>
          箭头 2
        </Button>
        <Button key="focusOn" type="primary" onClick={focusOn}>
          定位到五角星
        </Button>
        <Button
          key="undo"
          type="primary"
          onClick={() => lfRef?.current?.undo()}
        >
          上一步
        </Button>
        <Button
          key="redo"
          type="primary"
          onClick={() => lfRef?.current?.redo()}
        >
          下一步
        </Button>
        <Button
          key="clearData"
          type="primary"
          onClick={() => lfRef?.current?.clearData()}
        >
          清空数据
        </Button>
        <Button key="changeType" type="primary" onClick={handleChangeNodeType}>
          切换节点为五角星
        </Button>
        <Button
          key="changeConfig"
          type="primary"
          onClick={handleChangeEditConfig}
        >
          修改配置
        </Button>
        <Button key="cancelEdit" type="primary" onClick={handleCancelEdit}>
          取消编辑
        </Button>
        <Button key="changeEdgeId" type="primary" onClick={handleChangeId}>
          修改边 ID
        </Button>
      </Flex>
      <Divider orientation="left" orientationMargin="5" plain></Divider>
      <Flex wrap="wrap" gap="small">
        <Button
          key="getData"
          type="primary"
          onClick={() => console.log(lfRef?.current?.getGraphData())}
        >
          获取数据
        </Button>
        <Button
          key="getRefreshData"
          type="primary"
          onClick={handleRefreshGraph}
        >
          属性流程图节点 ID
        </Button>
        <Button
          key="setProperties"
          type="primary"
          onClick={handleActiveElements}
        >
          设置属性
        </Button>
        <Button
          key="setZoom"
          type="primary"
          onClick={() => lfRef.current?.zoom(0.6, [400, 400])}
        >
          设置大小
        </Button>
        <Button
          key="selectElement"
          type="primary"
          onClick={() => lfRef.current?.selectElementById('custom-node-1')}
        >
          选中指定节点
        </Button>
        <Button key="triggerLine" type="primary">
          触发边
        </Button>
        <Button
          key="translateCenter"
          type="primary"
          onClick={() => lfRef.current?.translateCenter()}
        >
          居中
        </Button>
        <Button
          key="fitView"
          type="primary"
          onClick={() => lfRef.current?.fitView()}
        >
          适应屏幕
        </Button>
        <Button key="getNodeEdges" type="primary" onClick={() => {}}>
          获取节点所有的边
        </Button>
        <Button
          key="openEdgeAnimation"
          type="primary"
          onClick={handleTurnAnimationOn}
        >
          开启边动画
        </Button>
        <Button
          key="closeEdgeAnimation"
          type="primary"
          onClick={handleTurnAnimationOff}
        >
          关闭边动画
        </Button>
        <Button key="showCanvas" type="primary">
          显示流程图
        </Button>
        <Button
          key="deleteNode"
          type="primary"
          onClick={() => lfRef.current?.deleteNode('custom-node-1')}
        >
          删除节点
        </Button>
      </Flex>
      <Divider orientation="left" orientationMargin="5" plain>
        节点面板
      </Divider>
      <Flex wrap="wrap" gap="small" justify="center" align="center">
        {/* <Button key="rect" type="primary">节点 1</Button> */}
        {/* <Button key="circle" type="primary">节点 2</Button> */}
        {/* <Button key="text" type="text">文本</Button> */}
        <div className="rect" onMouseDown={handleDragRect} />
        <div className="circle" onMouseDown={handleDragCircle} />
        <div className="text" onMouseDown={handleDragText}>
          文本
        </div>
      </Flex>
      <Divider />
      <div ref={containerRef} id="graph" className={styles.viewport}></div>
    </Card>
  )
}

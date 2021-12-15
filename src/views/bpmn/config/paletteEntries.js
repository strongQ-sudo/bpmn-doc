import { assign } from 'min-dash'
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg'
function createParticipant(event, autoActivate, elementFactory, bpmnFactory, model, create) {
    create.start(event, elementFactory.createParticipantShape());
  }
export default {
  'create.start-StartEvent': createAction(
    'bpmn:StartEvent',
    'event',
    'bpmn-icon-start-event-none',
    'Create StartEvent'
  ),
  'create.end-event': createAction(
    'bpmn:EndEvent',
    'event',
    'bpmn-icon-end-event-none',
    'Create EndEvent'
  ),
  'create.exclusive-gateway': createAction(
    'bpmn:ExclusiveGateway',
    'gateway',
    'bpmn-icon-gateway-none',
    'Create Gateway'
  ),
  'tool-separator': {
    group: 'tools',
    separator: true
  },
  'create.task': createAction(
    'bpmn:Task',
    'activity',
    'bpmn-icon-user-task',
    'Create Task',
    drawTask
  ),
  'create.event': createAction(
    'bpmn:IntermediateCatchEvent',
    'activity',
    'bpmn-icon-intermediate-event-catch-timer',
    'Create Event'
  ),
  'create.participant-expanded': {
      group: 'collaboration',
      className: 'bpmn-icon-participant',
      title: 'Create Pool/Participant',
      action: {
        dragstart: createParticipant,
        click: createParticipant
      }
    }
}

function createAction (
  type,
  group,
  className,
  title,
  drawShape,
  translate,
  options
) {
  var shortType = type.replace(/^bpmn:/, '')

  function createListener (event, autoActivate, elementFactory, bpmnFactory, model, create) {
    const prefix = type + +new Date() + '_'
    const id = model.ids.nextPrefixed(prefix, { type })
    const taskBusinessObject = bpmnFactory.create(type, { id, name: id })
    var shape = elementFactory.createShape(assign({ type: type }, options, { businessObject: taskBusinessObject }))

    if (options) {
      shape.businessObject.di.isExpanded = options.isExpanded
    }

    create.start(event, shape)
  }
  return {
    type,
    group: group,
    className: className,
    title: title || translate('Create {type}', { type: shortType }),
    drawShape,
    action: {
      dragstart: createListener,
      click: createListener
    }
  }
}

function drawCustomTask (parentNode, element, textRenderer, entries) {
  const width = 130
  const height = 60
  const borderRadius = 20
  const strokeColor = '#4483ec'
  const fillColor = !element.businessObject.suitable && '#a2c5fd'

  element.width = width
  element.height = height
  const rect = drawRect(
    parentNode,
    width,
    height,
    borderRadius,
    strokeColor,
    fillColor
  )
  const text = textRenderer.createText(element.businessObject.name || '', {
    box: element,
    align: 'center-middle',
    padding: 5,
    size: {
      width: 100
    }
  })
  svgAppend(parentNode, text)
  return rect
}

function drawTask (parentNode, element, textRenderer, entries) {
  const width = 100
  const height = 80
  const borderRadius = 20
  const strokeColor = element.businessObject.suitable
  const fillColor = '#fff'

  element.width = width
  element.height = height
  const rect = drawRect(
    parentNode,
    width,
    height,
    borderRadius,
    strokeColor,
    fillColor
  )
  const text = textRenderer.createText(element.businessObject.name || '', {
    box: element,
    align: 'center-middle',
    padding: 5,
    size: {
      width: 100
    }
  })
  svgAppend(parentNode, text)
  return rect
}

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect (
  parentNode,
  width,
  height,
  borderRadius,
  strokeColor,
  fillColor
) {
  const rect = svgCreate('rect')

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: strokeColor || '#000',
    strokeWidth: 2,
    fill: fillColor
  })

  svgAppend(parentNode, rect)

  return rect
}

// copied from https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js
// function prependTo (newNode, parentNode, siblingNode) {
//   parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild)
// }

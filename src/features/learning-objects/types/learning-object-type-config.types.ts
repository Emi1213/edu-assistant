import type { Component } from 'vue'

export interface LearningObjectTypeConfig {
  tabLabel: string
  createLabel: string
  icon: Component
  detailRouteName: string
  createModalComponent?: Component
  cardComponent?: Component
}

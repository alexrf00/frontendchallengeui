// src/features/graph/mockData.ts
import type { Node as XFNode, Edge as XFEdge } from '@xyflow/react';

// Extend XFNode’s data with your schema fields
export interface BlueprintNode extends XFNode {
  data: XFNode['data'] & {
    component_key: string;
    name: string;
    prerequisites: string[];
    [key: string]: any;
  };
}

export interface BlueprintEdge extends XFEdge {
  source: string;
  target: string;
}

// Raw blueprint JSON (only nodes & edges included)
const raw = {
  "nodes": [
    {
      "id": "form-bad163fd-09bd-4710-ad80-245f31b797d5",
      "type": "form",
      "position": {
        "x": 1437,
        "y": 264
      },
      "data": {
        "id": "bp_c_01jka1e3jwewhb2177h7901c5j",
        "component_key": "form-bad163fd-09bd-4710-ad80-245f31b797d5",
        "component_type": "form",
        "component_id": "f_01jk7ap2r3ewf9gx6a9r09gzjv",
        "name": "Form F",
        "prerequisites": [
          "form-0f58384c-4966-4ce6-9ec2-40b96d61f745",
          "form-e15d42df-c7c0-4819-9391-53730e6d47b3"
        ],
        "permitted_roles": [],
        "input_mapping": {},
        "sla_duration": {
          "number": 0,
          "unit": "minutes"
        },
        "approval_required": false,
        "approval_roles": []
      }
    },
    {
      "id": "form-0f58384c-4966-4ce6-9ec2-40b96d61f745",
      "type": "form",
      "position": {
        "x": 1093.4015147514929,
        "y": 155.2205909169969
      },
      "data": {
        "id": "bp_c_01jka1e3jzewhb9eqfq08rk90b",
        "component_key": "form-0f58384c-4966-4ce6-9ec2-40b96d61f745",
        "component_type": "form",
        "component_id": "f_01jk7ap2r3ewf9gx6a9r09gzjv",
        "name": "Form D",
        "prerequisites": [
          "form-a4750667-d774-40fb-9b0a-44f8539ff6c4"
        ],
        "permitted_roles": [],
        "input_mapping": {},
        "sla_duration": {
          "number": 0,
          "unit": "minutes"
        },
        "approval_required": false,
        "approval_roles": []
      }
    },
    {
      "id": "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88",
      "type": "form",
      "position": {
        "x": 494,
        "y": 269
      },
      "data": {
        "id": "bp_c_01jka1e3k0ewha8jbgeayz4cwp",
        "component_key": "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88",
        "component_type": "form",
        "component_id": "f_01jk7ap2r3ewf9gx6a9r09gzjv",
        "name": "Form A",
        "prerequisites": [],
        "permitted_roles": [],
        "input_mapping": {},
        "sla_duration": {
          "number": 0,
          "unit": "minutes"
        },
        "approval_required": false,
        "approval_roles": []
      }
    },
    {
      "id": "form-7c26f280-7bff-40e3-b9a5-0533136f52c3",
      "type": "form",
      "position": {
        "x": 779.0096360025458,
        "y": 362.36545334182
      },
      "data": {
        "id": "bp_c_01jka1e3k1ewhbfr03fcxg8qze",
        "component_key": "form-7c26f280-7bff-40e3-b9a5-0533136f52c3",
        "component_type": "form",
        "component_id": "f_01jk7aygnqewh8gt8549beb1yc",
        "name": "Form C",
        "prerequisites": [
          "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88"
        ],
        "permitted_roles": [],
        "input_mapping": {},
        "sla_duration": {
          "number": 0,
          "unit": "minutes"
        },
        "approval_required": false,
        "approval_roles": []
      }
    },
    {
      "id": "form-a4750667-d774-40fb-9b0a-44f8539ff6c4",
      "type": "form",
      "position": {
        "x": 780.692362673456,
        "y": 154.98072799490808
      },
      "data": {
        "id": "bp_c_01jka1e3k2ewha2z3p674dbyrx",
        "component_key": "form-a4750667-d774-40fb-9b0a-44f8539ff6c4",
        "component_type": "form",
        "component_id": "f_01jk7awbhqewgbkbgk8rjm7bv7",
        "name": "Form B",
        "prerequisites": [
          "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88"
        ],
        "permitted_roles": [],
        "input_mapping": {},
        "sla_duration": {
          "number": 0,
          "unit": "minutes"
        },
        "approval_required": false,
        "approval_roles": []
      }
    },
    {
      "id": "form-e15d42df-c7c0-4819-9391-53730e6d47b3",
      "type": "form",
      "position": {
        "x": 1099.7646441474558,
        "y": 361.86975131228957
      },
      "data": {
        "id": "bp_c_01jka1e3k3ewhbpfxt533q5hcw",
        "component_key": "form-e15d42df-c7c0-4819-9391-53730e6d47b3",
        "component_type": "form",
        "component_id": "f_01jk7ap2r3ewf9gx6a9r09gzjv",
        "name": "Form E",
        "prerequisites": [
          "form-7c26f280-7bff-40e3-b9a5-0533136f52c3"
        ],
        "permitted_roles": [],
        "input_mapping": {},
        "sla_duration": {
          "number": 0,
          "unit": "minutes"
        },
        "approval_required": false,
        "approval_roles": []
      }
    }
  ],
  "edges": [
    {
      "source": "form-0f58384c-4966-4ce6-9ec2-40b96d61f745",
      "target": "form-bad163fd-09bd-4710-ad80-245f31b797d5"
    },
    {
      "source": "form-e15d42df-c7c0-4819-9391-53730e6d47b3",
      "target": "form-bad163fd-09bd-4710-ad80-245f31b797d5"
    },
    {
      "source": "form-a4750667-d774-40fb-9b0a-44f8539ff6c4",
      "target": "form-0f58384c-4966-4ce6-9ec2-40b96d61f745"
    },
    {
      "source": "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88",
      "target": "form-7c26f280-7bff-40e3-b9a5-0533136f52c3"
    },
    {
      "source": "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88",
      "target": "form-a4750667-d774-40fb-9b0a-44f8539ff6c4"
    },
    {
      "source": "form-7c26f280-7bff-40e3-b9a5-0533136f52c3",
      "target": "form-e15d42df-c7c0-4819-9391-53730e6d47b3"
    }
  ],
};

export const initialNodes: BlueprintNode[] = raw.nodes.map(n => ({
  id: n.id,
  type: n.type,
  position: n.position,
  data: { ...n.data, name: n.data.name }
}));

export const initialEdges: BlueprintEdge[] = raw.edges.map((e, i) => ({
  id: `e${i}-${e.source}-${e.target}`,
  source: e.source,
  target: e.target,
  animated: true
}));

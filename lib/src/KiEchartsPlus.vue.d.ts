declare namespace _default {
    const name: string;
    namespace props {
        namespace type {
            const type_1: StringConstructor;
            export { type_1 as type };
            const _default: string;
            export { _default as default };
        }
        namespace option {
            const type_2: ObjectConstructor;
            export { type_2 as type };
            function _default_1(): {};
            export { _default_1 as default };
        }
        namespace cols {
            const type_3: ArrayConstructor;
            export { type_3 as type };
            function _default_2(): never[];
            export { _default_2 as default };
        }
        namespace data {
            const type_4: ArrayConstructor;
            export { type_4 as type };
            function _default_3(): never[];
            export { _default_3 as default };
        }
    }
    function data(): {
        chart: null;
    };
    function data(): {
        chart: null;
    };
    namespace plugins {
        export { pie };
        export { line };
    }
    namespace watch {
        export namespace type_5 {
            function handler(val: any): void;
            const immediate: boolean;
        }
        export { type_5 as type };
        export function data_1(): void;
        export { data_1 as data };
    }
    function mounted(): void;
    function mounted(): void;
    function beforeDestroy(): void;
    function beforeDestroy(): void;
    namespace methods {
        function init(): void;
        function init(): void;
        function resetOption(): void;
        function resetOption(): void;
    }
}
export default _default;
import pie from "./plugins/pie";
import line from "./plugins/line";

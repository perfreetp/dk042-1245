import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Calculator,
  Save,
  TrendingDown,
  Zap,
  BarChart3,
  Plus,
  History,
  Info,
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { calculateReduction, formatDate, formatDateTime } from "@/utils/helpers";
import { ProgressRing } from "@/components/ProgressRing";

export const Calculation = () => {
  const { id } = useParams();
  const { getProjectCalculations, addCalculation } = useProjectStore();
  const calculations = id ? getProjectCalculations(id) : [];

  const [formData, setFormData] = useState({
    baselineYear: "2024",
    baselineEnergy: 0,
    baselineFactor: 0.9419,
    monitoredPeriod: "",
    monitoredEnergy: 0,
    monitoredFactor: 0.9419,
    version: "v1.0",
  });

  const liveCalculation = useMemo(() => {
    return calculateReduction(
      Number(formData.baselineEnergy) || 0,
      Number(formData.baselineFactor) || 0,
      Number(formData.monitoredEnergy) || 0,
      Number(formData.monitoredFactor) || 0
    );
  }, [formData]);

  const reductionRate = useMemo(() => {
    const baselineEmission =
      Number(formData.baselineEnergy) * Number(formData.baselineFactor);
    if (baselineEmission === 0) return 0;
    return Math.round((liveCalculation / baselineEmission) * 10000) / 100;
  }, [formData, liveCalculation]);

  const baselineEmission =
    Number(formData.baselineEnergy) * Number(formData.baselineFactor);
  const monitoredEmission =
    Number(formData.monitoredEnergy) * Number(formData.monitoredFactor);

  const handleSave = () => {
    if (!id) return;
    addCalculation({
      projectId: id,
      ...formData,
      baselineEnergy: Number(formData.baselineEnergy),
      baselineFactor: Number(formData.baselineFactor),
      monitoredEnergy: Number(formData.monitoredEnergy),
      monitoredFactor: Number(formData.monitoredFactor),
    });
  };

  const updateField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const totalReduction = calculations.reduce((sum, c) => sum + c.reductionAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-4 gap-5">
        <div className="card p-5 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-sm">累计减排量</span>
            <TrendingDown className="w-5 h-5 text-white/60" />
          </div>
          <div className="text-3xl font-bold">
            {Math.round(totalReduction).toLocaleString()}
            <span className="text-lg font-normal text-white/70 ml-1">tCO₂e</span>
          </div>
          <div className="text-white/60 text-xs mt-2">基于 {calculations.length} 次测算</div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm">基准排放量</span>
            <Zap className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {Math.round(baselineEmission).toLocaleString()}
            <span className="text-sm font-normal text-gray-400 ml-1">tCO₂e</span>
          </div>
          <div className="text-gray-400 text-xs mt-2">
            {formData.baselineYear || "-"} 年基准
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm">监测期排放量</span>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {Math.round(monitoredEmission).toLocaleString()}
            <span className="text-sm font-normal text-gray-400 ml-1">tCO₂e</span>
          </div>
          <div className="text-gray-400 text-xs mt-2">
            {formData.monitoredPeriod || "-"}
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <ProgressRing
            progress={Math.min(reductionRate, 100)}
            size={80}
            strokeWidth={8}
            color="#0F766E"
            label={`${reductionRate}%`}
            sublabel="减排率"
          />
          <div>
            <div className="text-2xl font-bold text-primary-700">
              {liveCalculation.toLocaleString()}
              <span className="text-sm font-normal text-gray-400 ml-1">tCO₂e</span>
            </div>
            <div className="text-gray-400 text-xs mt-1">当期预计减排量</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-gray-600" />
            </div>
            <h3 className="section-title mb-0">减排量测算</h3>
          </div>

          <div className="mb-5 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-1">计算公式</div>
                <div className="font-mono text-xs">
                  减排量 = 基准能耗 × 基准排放因子 - 监测能耗 × 监测排放因子
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">
                基准数据
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label-text">基准年份</label>
                  <input
                    type="text"
                    value={formData.baselineYear}
                    onChange={(e) => updateField("baselineYear", e.target.value)}
                    className="input-field"
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="label-text">基准能耗 (MWh)</label>
                  <input
                    type="number"
                    value={formData.baselineEnergy || ""}
                    onChange={(e) => updateField("baselineEnergy", e.target.value)}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="label-text">排放因子 (tCO₂/MWh)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.baselineFactor || ""}
                    onChange={(e) => updateField("baselineFactor", e.target.value)}
                    className="input-field"
                    placeholder="0.9419"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">
                监测数据
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label-text">监测周期</label>
                  <input
                    type="text"
                    value={formData.monitoredPeriod}
                    onChange={(e) => updateField("monitoredPeriod", e.target.value)}
                    className="input-field"
                    placeholder="2025年Q1"
                  />
                </div>
                <div>
                  <label className="label-text">监测能耗 (MWh)</label>
                  <input
                    type="number"
                    value={formData.monitoredEnergy || ""}
                    onChange={(e) => updateField("monitoredEnergy", e.target.value)}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="label-text">排放因子 (tCO₂/MWh)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.monitoredFactor || ""}
                    onChange={(e) => updateField("monitoredFactor", e.target.value)}
                    className="input-field"
                    placeholder="0.9419"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">
                测算信息
              </div>
              <div>
                <label className="label-text">版本号</label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => updateField("version", e.target.value)}
                  className="input-field w-32"
                  placeholder="v1.0"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="bg-gradient-to-r from-primary-50 to-green-50 rounded-xl p-5 mb-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500 mb-1">预计减排量</div>
                  <div className="text-4xl font-bold text-primary-700">
                    {liveCalculation.toLocaleString()}
                    <span className="text-lg font-normal ml-1">tCO₂e</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">减排率</div>
                  <div className="text-2xl font-bold text-accent-600">{reductionRate}%</div>
                </div>
              </div>
            </div>
            <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
              <Save className="w-4 h-4" />
              保存测算版本
            </button>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center">
              <History className="w-4 h-4 text-accent-700" />
            </div>
            <h3 className="section-title mb-0">测算历史</h3>
          </div>

          {calculations.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <Calculator className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">暂无测算记录</p>
              <p className="text-gray-400 text-sm mt-1">完成左侧表单后点击保存</p>
            </div>
          ) : (
            <div className="space-y-3">
              {calculations
                .slice()
                .reverse()
                .map((calc, index) => (
                  <div
                    key={calc.id}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="badge bg-primary-100 text-primary-700">
                          {calc.version}
                        </span>
                        <span className="text-sm text-gray-600">{calc.monitoredPeriod}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDateTime(calc.calculatedAt)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400 text-xs mb-1">基准排放</div>
                        <div className="font-medium text-gray-700">
                          {Math.round(calc.baselineEnergy * calc.baselineFactor).toLocaleString()} t
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs mb-1">监测排放</div>
                        <div className="font-medium text-gray-700">
                          {Math.round(calc.monitoredEnergy * calc.monitoredFactor).toLocaleString()} t
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs mb-1">减排量</div>
                        <div className="font-bold text-primary-700">
                          {calc.reductionAmount.toLocaleString()} tCO₂e
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

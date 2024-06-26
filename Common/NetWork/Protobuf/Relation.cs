// <auto-generated>
//     Generated by the protocol buffer compiler.  DO NOT EDIT!
//     source: Relation.proto
// </auto-generated>
#pragma warning disable 1591, 0612, 3021
#region Designer generated code

using pb = global::Google.Protobuf;
using pbc = global::Google.Protobuf.Collections;
using pbr = global::Google.Protobuf.Reflection;
using scg = global::System.Collections.Generic;
namespace GamePKG {

  /// <summary>Holder for reflection information generated from Relation.proto</summary>
  public static partial class RelationReflection {

    #region Descriptor
    /// <summary>File descriptor for Relation.proto</summary>
    public static pbr::FileDescriptor Descriptor {
      get { return descriptor; }
    }
    private static pbr::FileDescriptor descriptor;

    static RelationReflection() {
      byte[] descriptorData = global::System.Convert.FromBase64String(
          string.Concat(
            "Cg5SZWxhdGlvbi5wcm90bxIHR2FtZVBLRxoPTWVzc2FnZUlELnByb3RvIqMB",
            "Cg9UZWFtQXBwbGljYW50Q0YSGQoFUGtnSUQYASABKA4yCi5QS0dUeXBlSUQS",
            "DgoGVXNlcklEGAIgASgEEg4KBlJvbGVJRBgDIAEoBBIQCghSb2xlTmFtZRgE",
            "IAEoCRIQCghWb2NhdGlvbhgFIAEoBRIOCgZHZW5kZXIYBiABKAUSDQoFTGV2",
            "ZWwYByABKAUSEgoKVmVyaWZ5Q29kZRgIIAEoCSJzCgpUZWFtSW5mb0NGEhkK",
            "BVBrZ0lEGAEgASgOMgouUEtHVHlwZUlEEg4KBlVzZXJJRBgCIAEoBBIOCgZU",
            "ZWFtSUQYAyABKAQSKgoIUm9sZUxpc3QYBCADKAsyGC5HYW1lUEtHLlRlYW1B",
            "cHBsaWNhbnRDRiJqCglMZWF2ZVRlYW0SGQoFUGtnSUQYASABKA4yCi5QS0dU",
            "eXBlSUQSDgoGVXNlcklEGAIgASgEEg4KBlJvbGVJRBgDIAEoBBIOCgZUZWFt",
            "SUQYBCABKAQSEgoKVmVyaWZ5Q29kZRgFIAEoCWIGcHJvdG8z"));
      descriptor = pbr::FileDescriptor.FromGeneratedCode(descriptorData,
          new pbr::FileDescriptor[] { global::MessageIDReflection.Descriptor, },
          new pbr::GeneratedClrTypeInfo(null, new pbr::GeneratedClrTypeInfo[] {
            new pbr::GeneratedClrTypeInfo(typeof(global::GamePKG.TeamApplicantCF), global::GamePKG.TeamApplicantCF.Parser, new[]{ "PkgID", "UserID", "RoleID", "RoleName", "Vocation", "Gender", "Level", "VerifyCode" }, null, null, null),
            new pbr::GeneratedClrTypeInfo(typeof(global::GamePKG.TeamInfoCF), global::GamePKG.TeamInfoCF.Parser, new[]{ "PkgID", "UserID", "TeamID", "RoleList" }, null, null, null),
            new pbr::GeneratedClrTypeInfo(typeof(global::GamePKG.LeaveTeam), global::GamePKG.LeaveTeam.Parser, new[]{ "PkgID", "UserID", "RoleID", "TeamID", "VerifyCode" }, null, null, null)
          }));
    }
    #endregion

  }
  #region Messages
  /// <summary>
  ///
  /// </summary>
  public sealed partial class TeamApplicantCF : pb::IMessage<TeamApplicantCF> {
    private static readonly pb::MessageParser<TeamApplicantCF> _parser = new pb::MessageParser<TeamApplicantCF>(() => new TeamApplicantCF());
    private pb::UnknownFieldSet _unknownFields;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public static pb::MessageParser<TeamApplicantCF> Parser { get { return _parser; } }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public static pbr::MessageDescriptor Descriptor {
      get { return global::GamePKG.RelationReflection.Descriptor.MessageTypes[0]; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    pbr::MessageDescriptor pb::IMessage.Descriptor {
      get { return Descriptor; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public TeamApplicantCF() {
      OnConstruction();
    }

    partial void OnConstruction();

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public TeamApplicantCF(TeamApplicantCF other) : this() {
      pkgID_ = other.pkgID_;
      userID_ = other.userID_;
      roleID_ = other.roleID_;
      roleName_ = other.roleName_;
      vocation_ = other.vocation_;
      gender_ = other.gender_;
      level_ = other.level_;
      verifyCode_ = other.verifyCode_;
      _unknownFields = pb::UnknownFieldSet.Clone(other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public TeamApplicantCF Clone() {
      return new TeamApplicantCF(this);
    }

    /// <summary>Field number for the "PkgID" field.</summary>
    public const int PkgIDFieldNumber = 1;
    private global::PKGTypeID pkgID_ = 0;
    /// <summary>
    ///
    /// </summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public global::PKGTypeID PkgID {
      get { return pkgID_; }
      set {
        pkgID_ = value;
      }
    }

    /// <summary>Field number for the "UserID" field.</summary>
    public const int UserIDFieldNumber = 2;
    private ulong userID_;
    /// <summary>
    ///
    /// </summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public ulong UserID {
      get { return userID_; }
      set {
        userID_ = value;
      }
    }

    /// <summary>Field number for the "RoleID" field.</summary>
    public const int RoleIDFieldNumber = 3;
    private ulong roleID_;
    /// <summary>
    ///
    /// </summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public ulong RoleID {
      get { return roleID_; }
      set {
        roleID_ = value;
      }
    }

    /// <summary>Field number for the "RoleName" field.</summary>
    public const int RoleNameFieldNumber = 4;
    private string roleName_ = "";
    /// <summary>
    ///
    /// </summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public string RoleName {
      get { return roleName_; }
      set {
        roleName_ = pb::ProtoPreconditions.CheckNotNull(value, "value");
      }
    }

    /// <summary>Field number for the "Vocation" field.</summary>
    public const int VocationFieldNumber = 5;
    private int vocation_;
    /// <summary>
    ///
    /// </summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public int Vocation {
      get { return vocation_; }
      set {
        vocation_ = value;
      }
    }

    /// <summary>Field number for the "Gender" field.</summary>
    public const int GenderFieldNumber = 6;
    private int gender_;
    /// <summary>
    ///
    /// </summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public int Gender {
      get { return gender_; }
      set {
        gender_ = value;
      }
    }

    /// <summary>Field number for the "Level" field.</summary>
    public const int LevelFieldNumber = 7;
    private int level_;
    /// <summary>
    ///
    /// </summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public int Level {
      get { return level_; }
      set {
        level_ = value;
      }
    }

    /// <summary>Field number for the "VerifyCode" field.</summary>
    public const int VerifyCodeFieldNumber = 8;
    private string verifyCode_ = "";
    /// <summary>
    ///
    /// </summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public string VerifyCode {
      get { return verifyCode_; }
      set {
        verifyCode_ = pb::ProtoPreconditions.CheckNotNull(value, "value");
      }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override bool Equals(object other) {
      return Equals(other as TeamApplicantCF);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public bool Equals(TeamApplicantCF other) {
      if (ReferenceEquals(other, null)) {
        return false;
      }
      if (ReferenceEquals(other, this)) {
        return true;
      }
      if (PkgID != other.PkgID) return false;
      if (UserID != other.UserID) return false;
      if (RoleID != other.RoleID) return false;
      if (RoleName != other.RoleName) return false;
      if (Vocation != other.Vocation) return false;
      if (Gender != other.Gender) return false;
      if (Level != other.Level) return false;
      if (VerifyCode != other.VerifyCode) return false;
      return Equals(_unknownFields, other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override int GetHashCode() {
      int hash = 1;
      if (PkgID != 0) hash ^= PkgID.GetHashCode();
      if (UserID != 0UL) hash ^= UserID.GetHashCode();
      if (RoleID != 0UL) hash ^= RoleID.GetHashCode();
      if (RoleName.Length != 0) hash ^= RoleName.GetHashCode();
      if (Vocation != 0) hash ^= Vocation.GetHashCode();
      if (Gender != 0) hash ^= Gender.GetHashCode();
      if (Level != 0) hash ^= Level.GetHashCode();
      if (VerifyCode.Length != 0) hash ^= VerifyCode.GetHashCode();
      if (_unknownFields != null) {
        hash ^= _unknownFields.GetHashCode();
      }
      return hash;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override string ToString() {
      return pb::JsonFormatter.ToDiagnosticString(this);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void WriteTo(pb::CodedOutputStream output) {
      if (PkgID != 0) {
        output.WriteRawTag(8);
        output.WriteEnum((int) PkgID);
      }
      if (UserID != 0UL) {
        output.WriteRawTag(16);
        output.WriteUInt64(UserID);
      }
      if (RoleID != 0UL) {
        output.WriteRawTag(24);
        output.WriteUInt64(RoleID);
      }
      if (RoleName.Length != 0) {
        output.WriteRawTag(34);
        output.WriteString(RoleName);
      }
      if (Vocation != 0) {
        output.WriteRawTag(40);
        output.WriteInt32(Vocation);
      }
      if (Gender != 0) {
        output.WriteRawTag(48);
        output.WriteInt32(Gender);
      }
      if (Level != 0) {
        output.WriteRawTag(56);
        output.WriteInt32(Level);
      }
      if (VerifyCode.Length != 0) {
        output.WriteRawTag(66);
        output.WriteString(VerifyCode);
      }
      if (_unknownFields != null) {
        _unknownFields.WriteTo(output);
      }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public int CalculateSize() {
      int size = 0;
      if (PkgID != 0) {
        size += 1 + pb::CodedOutputStream.ComputeEnumSize((int) PkgID);
      }
      if (UserID != 0UL) {
        size += 1 + pb::CodedOutputStream.ComputeUInt64Size(UserID);
      }
      if (RoleID != 0UL) {
        size += 1 + pb::CodedOutputStream.ComputeUInt64Size(RoleID);
      }
      if (RoleName.Length != 0) {
        size += 1 + pb::CodedOutputStream.ComputeStringSize(RoleName);
      }
      if (Vocation != 0) {
        size += 1 + pb::CodedOutputStream.ComputeInt32Size(Vocation);
      }
      if (Gender != 0) {
        size += 1 + pb::CodedOutputStream.ComputeInt32Size(Gender);
      }
      if (Level != 0) {
        size += 1 + pb::CodedOutputStream.ComputeInt32Size(Level);
      }
      if (VerifyCode.Length != 0) {
        size += 1 + pb::CodedOutputStream.ComputeStringSize(VerifyCode);
      }
      if (_unknownFields != null) {
        size += _unknownFields.CalculateSize();
      }
      return size;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void MergeFrom(TeamApplicantCF other) {
      if (other == null) {
        return;
      }
      if (other.PkgID != 0) {
        PkgID = other.PkgID;
      }
      if (other.UserID != 0UL) {
        UserID = other.UserID;
      }
      if (other.RoleID != 0UL) {
        RoleID = other.RoleID;
      }
      if (other.RoleName.Length != 0) {
        RoleName = other.RoleName;
      }
      if (other.Vocation != 0) {
        Vocation = other.Vocation;
      }
      if (other.Gender != 0) {
        Gender = other.Gender;
      }
      if (other.Level != 0) {
        Level = other.Level;
      }
      if (other.VerifyCode.Length != 0) {
        VerifyCode = other.VerifyCode;
      }
      _unknownFields = pb::UnknownFieldSet.MergeFrom(_unknownFields, other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void MergeFrom(pb::CodedInputStream input) {
      uint tag;
      while ((tag = input.ReadTag()) != 0) {
        switch(tag) {
          default:
            _unknownFields = pb::UnknownFieldSet.MergeFieldFrom(_unknownFields, input);
            break;
          case 8: {
            pkgID_ = (global::PKGTypeID) input.ReadEnum();
            break;
          }
          case 16: {
            UserID = input.ReadUInt64();
            break;
          }
          case 24: {
            RoleID = input.ReadUInt64();
            break;
          }
          case 34: {
            RoleName = input.ReadString();
            break;
          }
          case 40: {
            Vocation = input.ReadInt32();
            break;
          }
          case 48: {
            Gender = input.ReadInt32();
            break;
          }
          case 56: {
            Level = input.ReadInt32();
            break;
          }
          case 66: {
            VerifyCode = input.ReadString();
            break;
          }
        }
      }
    }

  }

  public sealed partial class TeamInfoCF : pb::IMessage<TeamInfoCF> {
    private static readonly pb::MessageParser<TeamInfoCF> _parser = new pb::MessageParser<TeamInfoCF>(() => new TeamInfoCF());
    private pb::UnknownFieldSet _unknownFields;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public static pb::MessageParser<TeamInfoCF> Parser { get { return _parser; } }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public static pbr::MessageDescriptor Descriptor {
      get { return global::GamePKG.RelationReflection.Descriptor.MessageTypes[1]; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    pbr::MessageDescriptor pb::IMessage.Descriptor {
      get { return Descriptor; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public TeamInfoCF() {
      OnConstruction();
    }

    partial void OnConstruction();

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public TeamInfoCF(TeamInfoCF other) : this() {
      pkgID_ = other.pkgID_;
      userID_ = other.userID_;
      teamID_ = other.teamID_;
      roleList_ = other.roleList_.Clone();
      _unknownFields = pb::UnknownFieldSet.Clone(other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public TeamInfoCF Clone() {
      return new TeamInfoCF(this);
    }

    /// <summary>Field number for the "PkgID" field.</summary>
    public const int PkgIDFieldNumber = 1;
    private global::PKGTypeID pkgID_ = 0;
    /// <summary>
    ///
    /// </summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public global::PKGTypeID PkgID {
      get { return pkgID_; }
      set {
        pkgID_ = value;
      }
    }

    /// <summary>Field number for the "UserID" field.</summary>
    public const int UserIDFieldNumber = 2;
    private ulong userID_;
    /// <summary>
    ///
    /// </summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public ulong UserID {
      get { return userID_; }
      set {
        userID_ = value;
      }
    }

    /// <summary>Field number for the "TeamID" field.</summary>
    public const int TeamIDFieldNumber = 3;
    private ulong teamID_;
    /// <summary>
    ///
    /// </summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public ulong TeamID {
      get { return teamID_; }
      set {
        teamID_ = value;
      }
    }

    /// <summary>Field number for the "RoleList" field.</summary>
    public const int RoleListFieldNumber = 4;
    private static readonly pb::FieldCodec<global::GamePKG.TeamApplicantCF> _repeated_roleList_codec
        = pb::FieldCodec.ForMessage(34, global::GamePKG.TeamApplicantCF.Parser);
    private readonly pbc::RepeatedField<global::GamePKG.TeamApplicantCF> roleList_ = new pbc::RepeatedField<global::GamePKG.TeamApplicantCF>();
    /// <summary>
    ///
    /// </summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public pbc::RepeatedField<global::GamePKG.TeamApplicantCF> RoleList {
      get { return roleList_; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override bool Equals(object other) {
      return Equals(other as TeamInfoCF);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public bool Equals(TeamInfoCF other) {
      if (ReferenceEquals(other, null)) {
        return false;
      }
      if (ReferenceEquals(other, this)) {
        return true;
      }
      if (PkgID != other.PkgID) return false;
      if (UserID != other.UserID) return false;
      if (TeamID != other.TeamID) return false;
      if(!roleList_.Equals(other.roleList_)) return false;
      return Equals(_unknownFields, other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override int GetHashCode() {
      int hash = 1;
      if (PkgID != 0) hash ^= PkgID.GetHashCode();
      if (UserID != 0UL) hash ^= UserID.GetHashCode();
      if (TeamID != 0UL) hash ^= TeamID.GetHashCode();
      hash ^= roleList_.GetHashCode();
      if (_unknownFields != null) {
        hash ^= _unknownFields.GetHashCode();
      }
      return hash;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override string ToString() {
      return pb::JsonFormatter.ToDiagnosticString(this);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void WriteTo(pb::CodedOutputStream output) {
      if (PkgID != 0) {
        output.WriteRawTag(8);
        output.WriteEnum((int) PkgID);
      }
      if (UserID != 0UL) {
        output.WriteRawTag(16);
        output.WriteUInt64(UserID);
      }
      if (TeamID != 0UL) {
        output.WriteRawTag(24);
        output.WriteUInt64(TeamID);
      }
      roleList_.WriteTo(output, _repeated_roleList_codec);
      if (_unknownFields != null) {
        _unknownFields.WriteTo(output);
      }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public int CalculateSize() {
      int size = 0;
      if (PkgID != 0) {
        size += 1 + pb::CodedOutputStream.ComputeEnumSize((int) PkgID);
      }
      if (UserID != 0UL) {
        size += 1 + pb::CodedOutputStream.ComputeUInt64Size(UserID);
      }
      if (TeamID != 0UL) {
        size += 1 + pb::CodedOutputStream.ComputeUInt64Size(TeamID);
      }
      size += roleList_.CalculateSize(_repeated_roleList_codec);
      if (_unknownFields != null) {
        size += _unknownFields.CalculateSize();
      }
      return size;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void MergeFrom(TeamInfoCF other) {
      if (other == null) {
        return;
      }
      if (other.PkgID != 0) {
        PkgID = other.PkgID;
      }
      if (other.UserID != 0UL) {
        UserID = other.UserID;
      }
      if (other.TeamID != 0UL) {
        TeamID = other.TeamID;
      }
      roleList_.Add(other.roleList_);
      _unknownFields = pb::UnknownFieldSet.MergeFrom(_unknownFields, other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void MergeFrom(pb::CodedInputStream input) {
      uint tag;
      while ((tag = input.ReadTag()) != 0) {
        switch(tag) {
          default:
            _unknownFields = pb::UnknownFieldSet.MergeFieldFrom(_unknownFields, input);
            break;
          case 8: {
            pkgID_ = (global::PKGTypeID) input.ReadEnum();
            break;
          }
          case 16: {
            UserID = input.ReadUInt64();
            break;
          }
          case 24: {
            TeamID = input.ReadUInt64();
            break;
          }
          case 34: {
            roleList_.AddEntriesFrom(input, _repeated_roleList_codec);
            break;
          }
        }
      }
    }

  }

  public sealed partial class LeaveTeam : pb::IMessage<LeaveTeam> {
    private static readonly pb::MessageParser<LeaveTeam> _parser = new pb::MessageParser<LeaveTeam>(() => new LeaveTeam());
    private pb::UnknownFieldSet _unknownFields;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public static pb::MessageParser<LeaveTeam> Parser { get { return _parser; } }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public static pbr::MessageDescriptor Descriptor {
      get { return global::GamePKG.RelationReflection.Descriptor.MessageTypes[2]; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    pbr::MessageDescriptor pb::IMessage.Descriptor {
      get { return Descriptor; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public LeaveTeam() {
      OnConstruction();
    }

    partial void OnConstruction();

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public LeaveTeam(LeaveTeam other) : this() {
      pkgID_ = other.pkgID_;
      userID_ = other.userID_;
      roleID_ = other.roleID_;
      teamID_ = other.teamID_;
      verifyCode_ = other.verifyCode_;
      _unknownFields = pb::UnknownFieldSet.Clone(other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public LeaveTeam Clone() {
      return new LeaveTeam(this);
    }

    /// <summary>Field number for the "PkgID" field.</summary>
    public const int PkgIDFieldNumber = 1;
    private global::PKGTypeID pkgID_ = 0;
    /// <summary>
    ///
    /// </summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public global::PKGTypeID PkgID {
      get { return pkgID_; }
      set {
        pkgID_ = value;
      }
    }

    /// <summary>Field number for the "UserID" field.</summary>
    public const int UserIDFieldNumber = 2;
    private ulong userID_;
    /// <summary>
    ///
    /// </summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public ulong UserID {
      get { return userID_; }
      set {
        userID_ = value;
      }
    }

    /// <summary>Field number for the "RoleID" field.</summary>
    public const int RoleIDFieldNumber = 3;
    private ulong roleID_;
    /// <summary>
    ///
    /// </summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public ulong RoleID {
      get { return roleID_; }
      set {
        roleID_ = value;
      }
    }

    /// <summary>Field number for the "TeamID" field.</summary>
    public const int TeamIDFieldNumber = 4;
    private ulong teamID_;
    /// <summary>
    ///
    /// </summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public ulong TeamID {
      get { return teamID_; }
      set {
        teamID_ = value;
      }
    }

    /// <summary>Field number for the "VerifyCode" field.</summary>
    public const int VerifyCodeFieldNumber = 5;
    private string verifyCode_ = "";
    /// <summary>
    ///
    /// </summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public string VerifyCode {
      get { return verifyCode_; }
      set {
        verifyCode_ = pb::ProtoPreconditions.CheckNotNull(value, "value");
      }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override bool Equals(object other) {
      return Equals(other as LeaveTeam);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public bool Equals(LeaveTeam other) {
      if (ReferenceEquals(other, null)) {
        return false;
      }
      if (ReferenceEquals(other, this)) {
        return true;
      }
      if (PkgID != other.PkgID) return false;
      if (UserID != other.UserID) return false;
      if (RoleID != other.RoleID) return false;
      if (TeamID != other.TeamID) return false;
      if (VerifyCode != other.VerifyCode) return false;
      return Equals(_unknownFields, other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override int GetHashCode() {
      int hash = 1;
      if (PkgID != 0) hash ^= PkgID.GetHashCode();
      if (UserID != 0UL) hash ^= UserID.GetHashCode();
      if (RoleID != 0UL) hash ^= RoleID.GetHashCode();
      if (TeamID != 0UL) hash ^= TeamID.GetHashCode();
      if (VerifyCode.Length != 0) hash ^= VerifyCode.GetHashCode();
      if (_unknownFields != null) {
        hash ^= _unknownFields.GetHashCode();
      }
      return hash;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override string ToString() {
      return pb::JsonFormatter.ToDiagnosticString(this);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void WriteTo(pb::CodedOutputStream output) {
      if (PkgID != 0) {
        output.WriteRawTag(8);
        output.WriteEnum((int) PkgID);
      }
      if (UserID != 0UL) {
        output.WriteRawTag(16);
        output.WriteUInt64(UserID);
      }
      if (RoleID != 0UL) {
        output.WriteRawTag(24);
        output.WriteUInt64(RoleID);
      }
      if (TeamID != 0UL) {
        output.WriteRawTag(32);
        output.WriteUInt64(TeamID);
      }
      if (VerifyCode.Length != 0) {
        output.WriteRawTag(42);
        output.WriteString(VerifyCode);
      }
      if (_unknownFields != null) {
        _unknownFields.WriteTo(output);
      }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public int CalculateSize() {
      int size = 0;
      if (PkgID != 0) {
        size += 1 + pb::CodedOutputStream.ComputeEnumSize((int) PkgID);
      }
      if (UserID != 0UL) {
        size += 1 + pb::CodedOutputStream.ComputeUInt64Size(UserID);
      }
      if (RoleID != 0UL) {
        size += 1 + pb::CodedOutputStream.ComputeUInt64Size(RoleID);
      }
      if (TeamID != 0UL) {
        size += 1 + pb::CodedOutputStream.ComputeUInt64Size(TeamID);
      }
      if (VerifyCode.Length != 0) {
        size += 1 + pb::CodedOutputStream.ComputeStringSize(VerifyCode);
      }
      if (_unknownFields != null) {
        size += _unknownFields.CalculateSize();
      }
      return size;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void MergeFrom(LeaveTeam other) {
      if (other == null) {
        return;
      }
      if (other.PkgID != 0) {
        PkgID = other.PkgID;
      }
      if (other.UserID != 0UL) {
        UserID = other.UserID;
      }
      if (other.RoleID != 0UL) {
        RoleID = other.RoleID;
      }
      if (other.TeamID != 0UL) {
        TeamID = other.TeamID;
      }
      if (other.VerifyCode.Length != 0) {
        VerifyCode = other.VerifyCode;
      }
      _unknownFields = pb::UnknownFieldSet.MergeFrom(_unknownFields, other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void MergeFrom(pb::CodedInputStream input) {
      uint tag;
      while ((tag = input.ReadTag()) != 0) {
        switch(tag) {
          default:
            _unknownFields = pb::UnknownFieldSet.MergeFieldFrom(_unknownFields, input);
            break;
          case 8: {
            pkgID_ = (global::PKGTypeID) input.ReadEnum();
            break;
          }
          case 16: {
            UserID = input.ReadUInt64();
            break;
          }
          case 24: {
            RoleID = input.ReadUInt64();
            break;
          }
          case 32: {
            TeamID = input.ReadUInt64();
            break;
          }
          case 42: {
            VerifyCode = input.ReadString();
            break;
          }
        }
      }
    }

  }

  #endregion

}

#endregion Designer generated code
